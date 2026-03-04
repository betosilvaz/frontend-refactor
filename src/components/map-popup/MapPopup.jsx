import styles from './MapPopup.module.css';

import { Link } from 'react-router';

const MapPopup = ({ data }) => {
  const {
    id,
    address,
    latitude,
    longitude,
    name,
    description,
    area,
    type,
    depth,
    slope,
    vegetation,
    situation,
    isAccessible,
    isMandatory,
    weight
  } = data;

  return (
    <div className={styles.container}>

      {/* 1. Cabeçalho (Nome ou Endereço) */}
      <div className={styles.header}>
        <h3 className={styles.title}>
          {name || address}
        </h3>

        <p className={styles.subtitle}>
          <svg className={styles.icon} viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {name ? address : `${latitude?.toFixed(5)}, ${longitude?.toFixed(5)}`}
        </p>
      </div>

      {/* 2. Badges (Condicionais) */}
      {(situation || isAccessible || isMandatory) && (
        <div className={styles.badges}>
          {situation && (
            <span className={`${styles.badge} ${styles.badgeBlue}`}>{situation}</span>
          )}
          {isAccessible && (
            <span className={`${styles.badge} ${styles.badgeGreen}`}>Acessível</span>
          )}
          {isMandatory && (
            <span className={`${styles.badge} ${styles.badgeAmber}`}>Obrigatório</span>
          )}
        </div>
      )}

      {/* 3. Grid de Dados Técnicos (Condicionais) */}
      <div className={styles.grid}>
        {type && <DetailItem label="Tipo" value={type} />}
        {area && <DetailItem label="Área" value={`${area} m²`} />}
        {depth && <DetailItem label="Prof." value={`${depth} cm`} />}
        {slope && <DetailItem label="Inclinação" value={`${slope}%`} />}
        {weight && <DetailItem label="Peso" value={`${weight} kg/m²`} />}
        {vegetation && <DetailItem label="Vegetação" value={vegetation} isFullWidth />}
      </div>

      {/* 4. Descrição (Se houver) */}
      {description && (
        <div className={styles.description}>
          <p>{description}</p>
        </div>
      )}

      {/* 5. Ação */}
      <div className={styles.action}>
        <Link to={`/green-roof/${id}`} className={styles.button}>Detalhes</Link>
      </div>

    </div>
  );
};

// Subcomponente auxiliar adaptado para CSS Modules
const DetailItem = ({ label, value, isFullWidth = false }) => (
  <div className={`${styles.detailItem} ${isFullWidth ? styles.detailFullWidth : ''}`}>
    <span className={styles.detailLabel}>{label}</span>
    <span className={styles.detailValue} title={value}>{value}</span>
  </div>
);

export default MapPopup;