import styles from './Home.module.css'
import { useRef, useEffect } from 'react'

import Map from '@components/map/Map'
import ActionBar from '@components/action-bar/ActionBar'

export default function Home() {

  const markers = [
    {
      name: 'Telhado verde SOFTEX',
      type: 'Extensivo',
      area: 734,
      latitude: -8.061616277946458, 
      longitude: -34.87220432682779,
      url: '/green-roof/1'
    }
  ];

  return (
    <>
      <ActionBar />
      <Map markers={markers}/>
    </>
  )
}