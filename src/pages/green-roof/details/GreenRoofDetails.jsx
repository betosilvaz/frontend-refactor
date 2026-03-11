import styles from './GreenRoofDetails.module.css';

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { createPortal } from 'react-dom';

// import Carousel from '@components/carousel/Carousel';
import Container from '@components/container/Container';
import ActionBar from '@components/action-bar/ActionBar';
import EditIcon from '@components/icons/EditIcon';
import FloatingButton from '@components/floating-button/FloatingButton';
import Carousel from './Carousel/Carousel';
import Map from '@components/map/Map';

import { API_URL } from '@config/api/api.js';
import { useAuth } from '@providers/AuthProvider';

// 1. Custom Hook para isolar a regra de negócio e requisições
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
        // Executa todas as requisições em paralelo para maior performance
        const [roofRes, reservoirRes] = await Promise.all([
          fetch(`${API_URL}/api/green-roofs/${id}`),
          fetch(`${API_URL}/api/green-roofs/${id}/reservoirs`)
        ]);

        // Se a requisição principal falhar, interrompemos e lançamos o erro
        if (!roofRes.ok) throw new Error("Não foi possível carregar os dados deste telhado.");
        
        const roofData = await roofRes.json();
        setData(roofData);
        const i = roofData.images?.map(img => API_URL+ "/" + img.url);
        setImages(i || []);

        // Tratamento tolerante a falhas para dados secundários
        if (reservoirRes.ok) {
          const reservoirData = await reservoirRes.json();
          setReservoir(reservoirData[0] || null);
        }

      } catch (err) {
        console.error(err);
        setError(err.message || "Erro inesperado ao carregar os dados.");
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, [id]);

  return { data, reservoir, images, loading, error };
}

// 2. Componente principal focado apenas em UI
export default function GreenRoofDetails() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { data, reservoir, images, loading, error } = useGreenRoofData(id);

  // Tratamento de Estados (Loading, Error, Empty)
  if (loading) {
    return (
      <Container variant="small">
        <div className={styles.loadingContainer}>Carregando detalhes do telhado verde...</div>
      </Container>
    );
  }

  if (error || !data) {
    return (
      <Container variant="small">
        <div className={styles.errorContainer}>
          <h2>Ops! Algo deu errado.</h2>
          <p>{error || "Nenhum dado encontrado."}</p>
          <Link to="/">Voltar para o início</Link>
        </div>
      </Container>
    );
  }

  return (
    <>
      <FloatingButton to="-1">Voltar</FloatingButton>
      { isAuthenticated && <UpdateButton id={id} /> }
      <ActionBar />
      
      <Container variant="small">
          { /* <Carousel images={images} /> */}
          <Carousel slides={images || []} options={{ loop: true }}/>
        
        <div className={styles.data}>
          <section className={styles.info}>
            <h1 className={styles.name}>{data.name}</h1>
            <p className={styles.description}>{data.description}</p>
          </section>
          
          <hr />
          
          {(data.type || data.area || data.slope || data.depth || data.weight) && (<section className={styles.infoGroup}>
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
                {data.vegetation.map(veg => (
                  <InfoItem label="" value={veg} />
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
    </>
  );
}

// 3. Micro-componente para evitar repetição de HTML
function InfoItem({ label, value }) {
  // Opcional: Não renderiza a linha se a informação não existir
  if (value === undefined || value === null || value === '') return null;

  return (
    <div className={styles.item}>
      {label && <span>{label}</span>}
      <span>{value}</span>
    </div>
  );
}

function UpdateButton({ id }) {
  if (typeof document === 'undefined') return null; // Previne erros em SSR (ex: Next.js)

  return createPortal(
    <Link to={`/green-roof/update/${id}`} className={styles.updateButton}>
      <EditIcon />
    </Link>,
    document.body
  );
}