import styles from './Home.module.css'

import { useRef, useEffect, useState } from 'react'

import Map from '@components/map/Map'
import ActionBar from '@components/action-bar/ActionBar'
import SearchBar from '@components/search-bar/SearchBar'

import  { API_URL } from '@config/api/api.js'
import toast from 'react-hot-toast'

export default function Home() {
  const [markers, setMarkers] = useState([]);
  const [initialPosition, setInitialPosition] = useState([-8.058211417035023, -34.871517645983225]); // São Paulo como posição inicial

  useEffect(() => {
    async function getGreenRoofs() {
      try {
        const response = await fetch(API_URL + '/api/green-roofs/all', {
          method: 'GET',
        });

        if (!response.ok) {
          console.log("Erro ao se comunicar com a API");
          return;
        }

        const data = await response.json();
        setMarkers(data);
      } catch (err) {
        console.log("Um erro inesperado aconteceu!");
      }

    }
    getGreenRoofs();
  }, []);

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


  return (
    <>
      <ActionBar />
      <SearchBar onSubmit={handleSubmit}/>
      <Map markers={markers} initialPosition={initialPosition}/>
    </>
  )
}