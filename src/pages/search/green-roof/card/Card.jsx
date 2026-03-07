import styles from './Card.module.css'

import { Link } from 'react-router'

import { API_URL } from '@config/api/api.js'

export default function Card({ data }) {
  return (
    <div className={styles.card}>
      {data?.images.length == 0 && <div className={styles.placeholder}>Sem imagens</div>}
      {data?.images && data?.images.length != 0 && <img src={`${API_URL}/${data.images[0].url}`} />}
      <div className={styles.cardInfo}>
        {data?.type && <span className={styles.tag}>{data.type}</span>}
        <h2>{data.name}</h2>
        <span className={styles.address}>{data.address}</span>
        <p className={styles.description}>{data.description}</p>
      </div>
      <Link className={styles.button} to={`/green-roof/${data?.id}`}>Detalhes</Link>
    </div>
  )
}