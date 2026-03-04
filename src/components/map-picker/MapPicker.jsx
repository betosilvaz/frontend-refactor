import styles from './MapPicker.module.css'

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';

import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';

export default function MapPicker({ marker, onConfirm, onExit }) {
  const [coords, setCoords] = useState(marker);
  const markerRef = useRef();

  function handleReturn(e) {
    e.preventDefault();
    onExit(e);
  }

  function handleConfirm(e) {
    e.preventDefault();
    if (!coords) return;
    onConfirm(coords);
  }

  useEffect(() => {
    setTimeout(() => {
      markerRef.current?.openPopup();
    }, 100);
  }, [coords]);

  const hasValidCoords = coords && coords?.lat !== undefined && coords?.lng !== undefined;

  return (
    <>
      <FloatingButton onClick={handleReturn}/>
      <ConfirmButton onConfirm={handleConfirm}/>
      <Message/>
      <MapContainer center={[-8.058211417035023, -34.871517645983225]} zoom={13} className={styles.map}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
        <MapClickHandler setCoords={setCoords}/>
        {hasValidCoords && (
          <Marker ref={markerRef} position={coords}>
            <Popup>Ponto selecionado</Popup>
          </Marker>
        )}
      </MapContainer>
    </>
  );
}

function FloatingButton({ onClick }) {
  return createPortal((
    <button type="button" className={styles.floatingButton} onClick={onClick}>Voltar</button>
  ), document.body);
}

function ConfirmButton({ onConfirm }) {
  return createPortal((
    <button type="button" className={styles.confirmButton} onClick={onConfirm}>Confirmar seleção</button>
  ), document.body);
}

function Message() {
  return createPortal( (
    <h1 className={styles.message}>Selecione um local</h1>
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