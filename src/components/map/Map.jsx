import styles from './Map.module.css'

import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { useEffect } from 'react'

import MapPopup from '@components/map-popup/MapPopup'
const { BaseLayer } = LayersControl;

export default function Map({ markers = [], initialPosition = [-8.058211417035023, -34.871517645983225] }) {

  return (
    <MapContainer center={initialPosition} zoom={13} className={styles.map}>
      <ChangeView center={initialPosition} zoom={16} />

      <LayersControl position="topright">
        <BaseLayer checked name="Mapa Colorido (Voyager)">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            keepBuffer={8}
          />
        </BaseLayer>

        <BaseLayer name="Mapa Escuro">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            keepBuffer={8}
          />
        </BaseLayer>

        <BaseLayer name="Mapa Claro">
          <TileLayer 
            url="https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            keepBuffer={8}
          />
        </BaseLayer>
      </LayersControl>
      <MarkerClusterGroup chunkLoading showCoverageOnHover={false} maxClusterRadius={50}>
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

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, {
        duration: 3,
        easeLinearity: 0.1
      });
    }
  }, [center, zoom, map]);

  return null;
}