import styles from './Map.module.css'

import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { GeoJSON } from 'react-leaflet'
import { useEffect, useState } from 'react'

import MapPopup from '@components/map-popup/MapPopup'
const { BaseLayer } = LayersControl;

export default function Map({ className, zoom = 16, markers = [], initialPosition = [-8.058211417035023, -34.871517645983225], simpleMarker = false }) {
  const [geoData, setGeoData] = useState(null);
  const [showLimits, setShowLimits] = useState(false);

  useEffect(() => {
    fetch('/limites_recife.json')
      .then(response => response.json())
      .then(data => setGeoData(data));
  }, []);

  const sudoeste = L.latLng(-8.200, -35.092);
  const nordeste = L.latLng(-7.890, -34.821);
  const limitesRecife = L.latLngBounds(sudoeste, nordeste);

  const estiloLimite = {
    color: "#2ecc71",      
    weight: 3,             
    fillColor: "#2ecc71",  
    fillOpacity: 0.1,      
    dashArray: "5, 5"      
  };
  
  return (
    <>  
      {!simpleMarker && (
        <div className={styles.toggleContainer}>
          <span className={styles.toggleLabel}>Limites do Recife</span>
          <label className={styles.switch}>
            <input 
              type="checkbox" 
              checked={showLimits}
              onChange={() => setShowLimits(!showLimits)}
            />
            <span className={`${styles.slider} ${styles.round}`}></span>
          </label>
        </div>
      )}

      <MapContainer center={initialPosition} zoom={13} minZoom={12} maxBounds={limitesRecife} maxBoundsViscosity={1} className={`${styles.map} ${className || ''}`}>
        <ChangeView center={initialPosition} zoom={zoom} />
        
        {geoData && showLimits && <GeoJSON data={geoData} style={estiloLimite}/>}

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
          <BaseLayer name="Satélite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            />
          </BaseLayer>
        </LayersControl>
        
        <MarkerClusterGroup chunkLoading showCoverageOnHover={false} maxClusterRadius={50}>
          {markers.map((marker, index) => (
            <Marker key={index} position={[marker.latitude, marker.longitude]}>
              {!simpleMarker && (
                <Popup>
                  <MapPopup data={marker}/>
                </Popup>
              )}
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </>
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