import styles from './Home.module.css'

import { useRef, useEffect, useState } from 'react'

import Map from '@components/map/Map'
import ActionBar from '@components/action-bar/ActionBar'

import  { API_URL } from '@config/api/api.js'

export default function Home() {
  const [markers, setMarkers] = useState([]);

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

  return (
    <>
      <ActionBar />
      <Map markers={markers}/>
    </>
  )
}