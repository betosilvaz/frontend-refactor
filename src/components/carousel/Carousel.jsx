import styles from './Carousel.module.css';

import { useState } from 'react';

import { API_URL } from '@config/api/api.js'

const Carousel = ({ images }) => {
  const [indiceAtual, setIndiceAtual] = useState(0);

  const proximaImagem = () => {
    if (indiceAtual === images.length - 1) {
      setIndiceAtual(0);
    } else {
      setIndiceAtual(indiceAtual + 1);
    }
  };

  const imagemAnterior = () => {
    if (indiceAtual === 0) {
      setIndiceAtual(images.length - 1);
    } else {
      setIndiceAtual(indiceAtual - 1);
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className={styles["carousel-container"]}>
        <span>Sem imagens</span>
      </div>
    )
  }

  return (
    <div className={styles["carousel-container"]}>
      <button onClick={imagemAnterior} className={`${styles["btn-control"]} ${styles["left"]}`}>&#10094;</button>
      <img
        src={`${API_URL}/${images[indiceAtual].url}`}
        alt={`Slide ${indiceAtual}`}
        className={styles["carousel-image"]}
      />
      <button onClick={proximaImagem} className={`${styles["btn-control"]} ${styles["right"]}`}>&#10095;</button>
    </div>
  );
};

export default Carousel;