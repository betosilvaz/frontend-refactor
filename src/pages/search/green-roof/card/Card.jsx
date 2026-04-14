import styles from './Card.module.css'
import { Link } from 'react-router'
import { API_URL } from '@config/api/api.js'
import { MapPin, ImageOff, ArrowRight } from 'lucide-react'

export default function Card({ data }) {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {data?.images && data?.images.length > 0 ? (
          <img src={`${API_URL}/${data.images[0].url}`} alt={`Imagem de ${data.name}`} loading="lazy" />
        ) : (
          <div className={styles.placeholder}>
            <ImageOff size={32} className={styles.placeholderIcon} />
            <span>Sem imagem</span>
          </div>
        )}
        {data?.type && <span className={styles.badge}>{data.type}</span>}
      </div>
      
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <h2 className={styles.title}>{data.name}</h2>
          <span className={styles.address}>
            <MapPin size={16} />
            {data.address}
          </span>
        </div>
        
        <p className={styles.description}>{data.description}</p>
        
        <div className={styles.cardFooter}>
          <Link className={styles.button} to={`/green-roof/${data?.id}`}>
            Ver Detalhes
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}