import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.jsx';

// 1. Estilo global da aplicação
import './global.css'; 

// 2. Estilos de biblioteca react-leaflet
import "leaflet/dist/leaflet.css";

// 3. Estilos da biblioteca react-leaflet-markercluster
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css';

// 4. Executa a configuração global dos ícones do Leaflet
import '@config/leaflet/leaflet-setup.js'; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);