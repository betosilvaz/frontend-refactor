import styles from './GreenRoofDetails.module.css';

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { createPortal } from 'react-dom';

import Container from '@components/container/Container';
import ActionBar from '@components/action-bar/ActionBar';
import EditIcon from '@components/icons/EditIcon';
import FloatingButton from '@components/floating-button/FloatingButton';
import Carousel from './Carousel/Carousel';
import Map from '@components/map/Map';

import fetchThis from "@utils/fetchThis.js";
import { API_URL } from '@config/api/api.js';
import { useAuth } from '@providers/AuthProvider';

function useGreenRoofData(id) {
  const [data, setData] = useState(null);
  const [reservoir, setReservoir] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchAllData() {
      setLoading(true);
      setError(null);

      try {
        const roofRes = await fetchThis(`${API_URL}/api/green-roofs/${id}`);

        if (!roofRes.ok) throw new Error("Não foi possível carregar os dados deste telhado.");
        
        const roofData = await roofRes.json();
        setData(roofData);

        const imgs = roofData.images?.map(img => API_URL+ "/" + img.url);
        setImages(imgs || []);

        setReservoir(roofData.reservoirs[0] || null);

      } catch (err) {
        setError(err.message || "Erro inesperado ao carregar os dados.");
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, [id]);

  return { data, reservoir, images, loading, error };
}

export default function GreenRoofDetails() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { data, reservoir, images, loading, error } = useGreenRoofData(id);

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <ActionBar />
        <Container variant="small">
          <div className={styles.loadingContainer}>Carregando detalhes do telhado verde...</div>
        </Container>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.pageWrapper}>
        <ActionBar />
        <Container variant="small">
          <div className={styles.errorContainer}>
            <h2>Ops! Algo deu errado.</h2>
            <p>{error || "Nenhum dado encontrado."}</p>
            <Link to="/">Voltar para o início</Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <FloatingButton to="-1">Voltar</FloatingButton>
      { isAuthenticated && <UpdateButton id={id} /> }
      <ActionBar />
      
      <Container variant="small">
          <Carousel slides={images || []} options={{ loop: true }}/>
        
        <div className={styles.data}>
          <section className={styles.info}>
            <h1 className={styles.name}>
              <span className={styles.highlight}>{data.name}</span>
            </h1>
            <p className={styles.description}>{data.description}</p>
          </section>
          
          <hr />
          
          {(data.type || data.area || data.slope || data.depth || data.weight) && (
            <section className={styles.infoGroup}>
              <h2>Detalhes técnicos</h2>
              <div>
                <InfoItem label="Tipo" value={data.type} />
                <InfoItem label="Área (m²)" value={data.area} />
                <InfoItem label="Inclinação (graus)" value={data.slope} />
                <InfoItem label="Profundidade (cm)" value={data.depth} />
                <InfoItem label="Peso (Kg/m²)" value={data.weight} />
                <InfoItem label="É acessível?" value={data.isAccessible ? "Sim" : "Não"}/>
                <InfoItem label="É obrigatório por lei?" value={data.isMandatory ? "Sim" : "Não"}/>
              </div>
            </section>
          )}

          {data.vegetation && data.vegetation.length > 0 && (
            <section className={styles.infoGroup}>
              <h2>Vegetação</h2>
              <div>
                {data.vegetation.map((veg, index) => (
                  <InfoItem key={index} label="" value={capitalize(veg.name)} />
                ))}
              </div>
            </section>
          )}

          {reservoir && (
            <section className={styles.infoGroup}>
              <h2>Reservatório</h2>
              <div>
                <InfoItem label="Nome" value={reservoir.name} />
                <InfoItem label="Tipo" value={reservoir.type} />
                <InfoItem label="Volume (Litros)" value={reservoir.capacity} />
                <InfoItem label="Material" value={reservoir.material} />
                <InfoItem label="Casos de uso" value={reservoir.useCases} />
              </div>
            </section>
          )}

          <section className={styles.infoGroup}>
            <h2>Localização</h2>
            <Map className={styles.map} zoom={13} markers={[{ latitude: data.latitude, longitude: data.longitude }]} initialPosition={[data.latitude, data.longitude]} simpleMarker={true} />
            <div>
              <InfoItem label="Latitude" value={data.latitude} />
              <InfoItem label="Longitude" value={data.longitude} />
              <InfoItem label="Endereço" value={data.address} />
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}

function InfoItem({ label, value }) {
  if (value === undefined || value === null || value === '') return null;

  return (
    <div className={styles.item}>
      {label && <span className={styles.itemLabel}>{label}</span>}
      <span className={styles.itemValue}>{value}</span>
    </div>
  );
}

function UpdateButton({ id }) {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <Link to={`/green-roof/update/${id}`} className={styles.updateButton}>
      <EditIcon />
    </Link>,
    document.body
  );
}

function capitalize(phrase) {
  return phrase
    ?.toLowerCase()
    .split(" ")
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}