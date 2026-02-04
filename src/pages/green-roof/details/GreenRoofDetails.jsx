import styles from './GreenRoofDetails.module.css'

import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import Carousel from '@components/carousel/Carousel'
import Container from '@components/container/Container'
import ActionBar from '@components/action-bar/ActionBar'

import { API_URL } from '@config/api/api.js'

export default function GreenRoofDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [reservoir, setReservoir] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      await getRoofs();
      await getReservoirs();
      await getImages();
      setLoading(false);
    }

    getData();
  }, [id]);

  async function getRoofs() {
    try {
      const response = await fetch(API_URL + '/api/green-roofs/' + id, {
        method: 'GET',
      });

      if (!response.ok) {
        // TODO: implementar uma tela de erro
        console.log("ERRO NA API: Não foi possível carregar os dados deste telhado!");
      }

      const data = await response.json();
      console.log(data);
      setData(data);

    } catch (err) {
      console.log("Erro inesperado ao carregar dados do telhado!");
    }
  }

  async function getReservoirs() {
    try {
      const response = await fetch(API_URL + `/api/green-roofs/${id}/reservoirs`, {
        method: 'GET'
      });

      if (!response.ok) {
        console.log("ERRO NA API: não foi possível carregar os dados do reservatório");
        return;
      }

      const data = await response.json();
      setReservoir(data[0]);

    } catch (err) {
      console.log("Erro inesperado ao carregar dados do reservatório");
    }
  }

  async function getImages() {
    try {

      const endpoint = `${API_URL}/api/green-roofs/${id}/images`;
      const response = await fetch(endpoint, {
        method: 'GET'
      })

      if (!response.ok) {
        console.log("Erro na api: não foi possível retornar as imagens");
        return;
      }

      const data = await response.json();
      console.log(data[0].url);

      setImages(data);

    } catch (err) {

    }
  }

  if (loading) return <span>Carregando...</span>

  return (
    <>
      <ActionBar />
      <Container variant="small">
        <Carousel images={images} />
        <div className={styles.data}>
          <section className={styles.info}>
            <h1 className={styles.name}>{data.name}</h1>
            <p className={styles.description}>{data.description}</p>
          </section>
          <hr />
          <section className={styles.infoGroup}>
            <h2>Detalhes técnicos</h2>
            <div>
              <div className={styles.item}>
                <span>Tipo</span>
                <span>{data.type}</span>
              </div>
              <div className={styles.item}>
                <span>Área</span>
                <span>{data.area}</span>
              </div>
              <div className={styles.item}>
                <span>Inclinação (graus)</span>
                <span>{data.slope}</span>
              </div>
              <div className={styles.item}>
                <span>Profundidade (cm)</span>
                <span>{data.depth}</span>
              </div>
              <div className={styles.item}>
                <span>Peso (Kg/m²)</span>
                <span>{data.weight}</span>
              </div>
            </div>
          </section>
          {reservoir && (
            <section className={styles.infoGroup}>
              <h2>Reservatório</h2>
              <div>
                <div className={styles.item}>
                  <span>Nome</span>
                  <span>{reservoir?.name}</span>
                </div>
                <div className={styles.item}>
                  <span>Tipo</span>
                  <span>{reservoir?.type}</span>
                </div>
                <div className={styles.item}>
                  <span>Volume (Litros)</span>
                  <span>{reservoir?.capacity}</span>
                </div>
                <div className={styles.item}>
                  <span>Material</span>
                  <span>{reservoir?.material}</span>
                </div>
                <div className={styles.item}>
                  <span>Casos de uso</span>
                  <span>{reservoir?.useCases}</span>
                </div>
              </div>
            </section>
          )}
          <section className={styles.infoGroup}>
            <h2>Localização</h2>
            <div>
              <div className={styles.item}>
                <span>Latitude</span>
                <span>{data.latitude}</span>
              </div>
              <div className={styles.item}>
                <span>Longitude</span>
                <span>{data.longitude}</span>
              </div>
            </div>
          </section>
        </div>
      </Container>
    </>
  )
}