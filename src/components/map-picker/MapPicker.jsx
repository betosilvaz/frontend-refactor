import styles from './MapPicker.module.css'

import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, LayersControl } from 'react-leaflet';
import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';

import SearchBar from '@components/search-bar/SearchBar';

const { BaseLayer } = LayersControl;

export default function MapPicker({ marker, onConfirm, onExit }) {
  const [coords, setCoords] = useState(marker);
  const [initialPosition, setInitialPosition] = useState((marker && marker?.lat !== undefined && marker?.lng !== undefined) ? marker : [-8.058211417035023, -34.871517645983225]);
  const markerRef = useRef();

  function handleConfirm(e) {
    e.preventDefault();
    if (!coords) return;
    onConfirm(coords);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const query = event.target.query.value;
    try {
      let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      let response = await fetch(url, {
        headers: {
          'User-Agent': 'GreenRoofApp/1.0'
        }
      });

      if (!response.ok) {
        return toast.error("Erro ao se comunicar com o serviço de geocodificação");
      }

      let data = await response.json();

      if (data.length === 0) {
        return toast.error("Nenhum resultado encontrado para o endereço informado");
      }

      const { lat, lon, display_name } = data[0];
      
      setInitialPosition([parseFloat(lat), parseFloat(lon)]);
      toast.success(`Localização atualizada para: ${display_name}`);
    } catch (err) {
      toast.error("Um erro inesperado aconteceu ao buscar o endereço");
    }
  }

  useEffect(() => {
    setTimeout(() => {
      markerRef.current?.openPopup();
    }, 100);
  }, [coords]);

  const hasValidCoords = coords && coords?.lat !== undefined && coords?.lng !== undefined;

  return (
    <>
      <SearchBar onSubmit={handleSubmit}/>
      <ConfirmButton onConfirm={handleConfirm}/>
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
        <MapClickHandler setCoords={setCoords}/>
        {hasValidCoords && (
          <Marker ref={markerRef} position={coords}>
            <Popup>
              <div className={styles.popup}>
                Ponto selecionado
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </>
  );
}

function ConfirmButton({ onConfirm }) {
  return createPortal((
    <button type="button" className={styles.confirmButton} onClick={onConfirm}>Confirmar seleção</button>
  ), document.body);
}

function MapClickHandler({ setCoords }) {
  useMapEvents({
    click(e) {
      setCoords(e.latlng);
    }
  })
  return null;
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