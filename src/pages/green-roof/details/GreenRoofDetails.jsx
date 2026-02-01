import styles from './GreenRoofDetails.module.css'

import Carousel from '@components/carousel/Carousel'
import Container from '@components/container/Container'
import ActionBar from '@components/action-bar/ActionBar'

export default function GreenRoofDetails() {

  const images = [
    "https://pegoriniarquitetura.com.br/wp-content/uploads/2023/09/QUAIS-VANTAGENS-E-DESVANTAGENS-DO-TELHADO-VERDE___.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJM-WCeEgGLAXtN8KJFI2InXqgaCsbUFufIg&s",
  ];

  const data = {
    name: "Telhado Verde SOFTEX",
    description: "  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.",
    address: "Rua da Aurora, 245",
    conclusion: 2026,
    latitude: -8.061904930037372,
    longitude: -34.872218781184536,
    type: "Intensivo",
    area: 725,
    slope: 2,
    depth: 95,
    weight: 130.40,
    isAcessible: true,
    isMandatory: true,
    images: [
      "https://pegoriniarquitetura.com.br/wp-content/uploads/2023/09/QUAIS-VANTAGENS-E-DESVANTAGENS-DO-TELHADO-VERDE___.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJM-WCeEgGLAXtN8KJFI2InXqgaCsbUFufIg&s",
    ],
    reservoirName: "Reservatório 1",
    reservoirType: "Acúmulo",
    reservoirMaterial: "Concreto",
    reservoirUseCases: "Lavar chão",
    reservoirVolume: 5000,
  }

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
          <section className={styles.infoGroup}>
            <h2>Reservatório</h2>
            <div>
              <div className={styles.item}>
                <span>Nome</span>
                <span>{data.reservoirName}</span>
              </div>
              <div className={styles.item}>
                <span>Tipo</span>
                <span>{data.reservoirType}</span>
              </div>
              <div className={styles.item}>
                <span>Volume (Litros)</span>
                <span>{data.reservoirVolume}</span>
              </div>
              <div className={styles.item}>
                <span>Material</span>
                <span>{data.reservoirMaterial}</span>
              </div>
              <div className={styles.item}>
                <span>Casos de uso</span>
                <span>{data.reservoirUseCases}</span>
              </div>
            </div>
          </section>
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