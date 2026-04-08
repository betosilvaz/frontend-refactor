import styles from './Card.module.css'
import { Link } from 'react-router' // Corrigido de 'react-router' para 'react-router-dom' dependendo da sua versão, mas mantive o seu original
import { API_URL } from '@config/api/api.js'

export default function Card({ data }) {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {data?.images && data?.images.length > 0 ? (
          <img src={`${API_URL}/${data.images[0].url}`} alt={`Imagem de ${data.name}`} loading="lazy" />
        ) : (
          <div className={styles.placeholder}>Sem imagem</div>
        )}
        {data?.type && <span className={styles.badge}>{data.type}</span>}
      </div>
      
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <h2 className={styles.title}>{data.name}</h2>
          <span className={styles.address}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            {data.address}
          </span>
        </div>
        
        <p className={styles.description}>{data.description}</p>
        
        <div className={styles.cardFooter}>
          <Link className={styles.button} to={`/green-roof/${data?.id}`}>
            Ver Detalhes
          </Link>
        </div>
      </div>
    </div>
  )
}