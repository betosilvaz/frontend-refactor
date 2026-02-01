import styles from './Card.module.css'

import { Link } from 'react-router'

export default function Card({ data }) {
  return (
    <div className={styles.card}>
      <img src={data.image} />
      <div className={styles.cardInfo}>
        <h2>{data.name}</h2>
        <span className={styles.tag}>{data.type}</span>
        <span className={styles.address}>{data.address}</span>
        <p className={styles.description}>{data.description}</p>
      </div>
      <Link className={styles.button} to={data.url}>Detalhes</Link>
    </div>
  )
}