import styles from './Map.module.css'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import Button from '@components/button/Button'
import { Link } from 'react-router';

export default function Map({ markers = []}) {
  const circles = {
    "Extensivo": '🟢',
    "Semi-Intensivo": '🟡',
    "Intensivo": '🔴'
  }

  return (
    <MapContainer center={[-8.058211417035023, -34.871517645983225]} zoom={13} className={styles.map}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap"/>
      {markers.map((marker) => (
        <Marker position={[marker.latitude, marker.longitude]}>
          <Popup>
            <div className={styles.popup}>
              <h2>{circles[marker.type]} {marker.name}</h2>
              <div className={styles.popupData}>
                <div className={styles.dataItem}>
                  <h3>Tipo</h3>
                  <span>{marker.type}</span>
                </div>
                <div className={styles.dataItem}>
                  <h3>Área</h3>
                  <span>{marker.area}m²</span>
                </div>
              </div>
              <Link to={marker.url} className={styles.button}>Detalhes</Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
