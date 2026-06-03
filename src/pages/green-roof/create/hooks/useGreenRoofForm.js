import { stateReducer, initialState } from "./../reducers/stateReducer.js"

import { useReducer, useState } from "react";
import toast from "react-hot-toast";

import fetchThis from "@utils/fetchThis.js";

function useGreenRoofForm() {
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [successfullySubmitted, setSuccessfullySubmitted] = useState(false);
  const [state, dispatch] = useReducer(stateReducer, initialState);

  const setLocation = (coords) => {
    if (coords == undefined) return;

    const options = { headers: { "User-Agent": "GreenRoofApp/1.0" } };
    const enpoint = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&email=gilbertozn527@gmail.com`;
    fetchThis(enpoint, options)
      .then(res => res.json())
      .then(data => {
        dispatch({ 
          type: "set-location", 
          latitude: coords.lat, 
          longitude: coords.lng, 
          address: data.display_name
        });
        setIsPickingLocation(false);
      })
      .catch(err => {
        toast.error("Não foi possível obter o endereço a partir da localização. Por favor, tente novamente.");
      });
  }

  const actualLocation = () => {
    if (!navigator.geolocation) return toast.error("Geolocalização não é suportada pelo seu navegador!");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude, 
          lng: position.coords.longitude 
        };
        setLocation(coords);
      }, (error) => {
        toast.error("Não foi possível obter sua localização atual. Por favor, selecione manualmente no mapa.");
      }
    );
  }

  return {
    isPickingLocation,
    setIsPickingLocation,
    successfullySubmitted,
    setSuccessfullySubmitted,
    state,
    dispatch,
    setLocation,
    actualLocation,
  }

}

export default useGreenRoofForm;