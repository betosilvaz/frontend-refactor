import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// 1. Corrige o problema de caminhos dos ícones padrão do Leaflet no React
delete L.Icon.Default.prototype._getIconUrl;

// 2. Define as imagens default utilizadas para marcadores no mapa
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});