import { useState, useReducer, useEffect } from "react";

import { stateReducer, initialState } from "../reducers/stateReducer";
import { API_URL } from "@config/api/api.js";

export default function useGreenRoofForm(id) {
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [successfullySubmitted, setSuccessfullySubmitted] = useState(false);
  const [state, dispatch] = useReducer(stateReducer, initialState);

  useEffect(() => {
    async function fetchGreenRoof() {
      const endpoint = `${API_URL}/api/green-roofs/${id}`;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("jwt"),
        },
      }
      try {
        const response = await fetch(endpoint, options);
        if (!response.ok) throw new Error("Erro ao buscar dados do telhado!");
        const data = await response.json();
        dispatch({ type: "set-location", latitude: data.latitude, longitude: data.longitude, address: data.address });
        dispatch({ type: "on-greenroof-change", name: "id", value: id});
        dispatch({ type: "on-greenroof-change", name: "name", value: data.name });
        dispatch({ type: "on-greenroof-change", name: "area", value: data.area });
        dispatch({ type: "on-greenroof-change", name: "type", value: data.type });
        dispatch({ type: "on-greenroof-change", name: "isAccessible", value: data.isAccessible });
        dispatch({ type: "on-greenroof-change", name: "isMandatory", value: data.isMandatory });
        dispatch({ type: "on-greenroof-change", name: "conclusion", value: data.conclusion });
        dispatch({ type: "on-greenroof-change", name: "description", value: data.description });
        dispatch({ type: "on-greenroof-change", name: "situation", value: data.situation });
        dispatch({ type: "on-greenroof-change", name: "depth", value: data.depth });
        dispatch({ type: "on-greenroof-change", name: "weight", value: data.weight });
        dispatch({ type: "on-greenroof-change", name: "slope", value: data.slope });
        dispatch({ type: "on-greenroof-change", name: "ownerName", value: data.ownerName });
        dispatch({ type: "on-greenroof-change", name: "ownerEmail", value: data.ownerEmail });
        dispatch({ type: "on-greenroof-change", name: "ownerNumber", value: data.ownerNumber });
        dispatch({ type: "set-original-vegetation", value: data.vegetation });
        if (data.reservoirs && data.reservoirs.length > 0) {
          dispatch({ type: "on-reservoir-change", name: "id", value: data.reservoirs[0].id});
          dispatch({ type: "on-reservoir-change", name: "capacity", value: data.reservoirs[0].capacity });
          dispatch({ type: "on-reservoir-change", name: "name", value: data.reservoirs[0].name });
          dispatch({ type: "on-reservoir-change", name: "useCases", value: data.reservoirs[0].useCases });
          dispatch({ type: "on-reservoir-change", name: "material", value: data.reservoirs[0].material });
          dispatch({ type: "on-reservoir-change", name: "type", value: data.reservoirs[0].type });
        }
        if (data.images) {
          dispatch({
            type: "set-original-images",
            images: data.images.map(img => ({
              id: img.id,
              url: img.url
            }))
          });
        }
      } catch (err) {
        toast.error("Erro ao buscar dados do telhado!");
      }
    }
    fetchGreenRoof();
  }, []);

  function actualLocation() {
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

  function setLocation(coords) {
    if (coords == undefined) return;

    const options = { headers: { "User-Agent": "GreenRoofApp/1.0" } };
    const enpoint = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&email=gilbertozn527@gmail.com`;
    fetch(enpoint, options)
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


  return {
    isPickingLocation,
    setIsPickingLocation,
    successfullySubmitted,
    setSuccessfullySubmitted,
    state,
    dispatch,
    actualLocation,
    setLocation,
  }
}