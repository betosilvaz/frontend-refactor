import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import Map from '@components/map/Map';
import ActionBar from '@components/action-bar/ActionBar';
import SearchBar from '@components/search-bar/SearchBar';

import fetchThis from "@utils/fetchThis.js";
import { API_URL } from '@config/api/api.js';

const RECIFE_COORDS = [-8.058211417035023, -34.871517645983225];

export default function Home() {
  const [markers, setMarkers] = useState([]);
  const [position, setPosition] = useState(RECIFE_COORDS);

  useEffect(() => {
    async function getGreenRoofs() {
      try {
        const response = await fetchThis(`${API_URL}/api/green-roofs/all`);
        if (!response.ok) {
          toast.error("Erro de comunicação com a API.");
          console.error("Erro: Não foi possível obter os dados da API. Status:", response.status);
          return;
        }
        const data = await response.json();
        setMarkers(data);
      } catch (err) {
        toast.error(`Erro de comunicação com a API.`);
        console.error("Erro: Não foi possível obter os dados da API: ", err.message);
      }
    }
    getGreenRoofs();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const query = event.target.query.value;

    try {
      let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      let response = await fetchThis(url, { headers: { 'User-Agent': 'GreenRoofApp/1.0' } });

      if (!response.ok)  {
        toast.error("Erro ao se comunicar com o serviço de geocodificação");
        return;
      }

      let data = await response.json();

      if (data.length === 0)  {
        toast.error("Nenhum resultado encontrado para o endereço informado");
        return;
      }

      const { lat, lon, display_name } = data[0];
      
      setPosition([parseFloat(lat), parseFloat(lon)]);
    } catch (err) {
      toast.error("Um erro inesperado aconteceu ao buscar o endereço");
      console.log("Erro ao buscar endereço: ", err.message);
    }
  }

  return (
    <>
      <ActionBar />
      <SearchBar onSubmit={handleSubmit}/>
      <Map markers={markers} initialPosition={position}/>
    </>
  )
}