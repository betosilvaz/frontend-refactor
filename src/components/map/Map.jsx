import styles from './Map.module.css'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { Link } from 'react-router'

import MapPopup from '@components/map-popup/MapPopup'

export default function Map({ markers = []}) {
  const circles = {
    "Extensivo": '🟢',
    "Semi-Intensivo": '🟡',
    "Intensivo": '🔴'
  }

  return (
    <MapContainer center={[-8.058211417035023, -34.871517645983225]} zoom={13} className={styles.map}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap"/>
      <MarkerClusterGroup chunkLoading>
        {markers.map((marker) => (
          <Marker position={[marker.latitude, marker.longitude]}>
            <Popup>
              <MapPopup data={marker}/>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
