import styles from "./CreateGreenRoof.module.css"

import Tabs from "@components/tabs/Tabs.jsx"
import ActionBar from '@components/action-bar/ActionBar'
import TechnicalSection from "./components/technical-section/TechnicalSection"
import ReservoirSection from "./components/reservoir-section/ReservoirSection"
import ImageSection from "./components/image-section/ImageSection"
import SaveSection from "./components/save-section/SaveSection"
import Container from '@components/container/Container'
import MapPicker from "@components/map-picker/MapPicker"
import SuccessScreen from "./components/success-screen/SuccessScreen"

import useSubmit from "./hooks/useSubmit.js"
import { stateReducer, initialState } from "./reducers/stateReducer.js"

import { useState, useReducer } from "react";
import toast from "react-hot-toast";

export default function CreateGreenRoof() {
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [successfullySubmitted, setSuccessfullySubmitted] = useState(false);
  const [greenRoofId, setGreenRoofId] = useState(null);
  const [state, dispatch] = useReducer(stateReducer, initialState);
  const { submitGreenRoof, submitReservoir, submitImages, validate } = useSubmit();

  function actualLocation() {
    if (!navigator.geolocation) return toast.error("Geolocalização não é suportada pelo seu navegador!");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude, 
          lng: position.coords.longitude 
        };
        console.log(coords);
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

  function onGreenRoofChange(e) {
    const { name, value, type, checked } = e.target;

    const finalValue = type === "checkbox" ? checked : value;

    dispatch({ type: "on-greenroof-change", name, value: finalValue });
  }

  function onReservoirChange(e) {
    const { name, value } = e.target;
    dispatch({ type: "on-reservoir-change", name, value });
  }

  function onVegetationChange(tags) {
    dispatch({ type: "on-vegetation-change", tags });
  };

  function addImage(image) {
    dispatch({ type: "add-image", image });
  }

  function removeImage(image, index) {
    dispatch({ type: "remove-image", image, index });
  }

  async function submit() {
    if (!validate(state)) return toast.error("Por favor, preencha todos os campos obrigatórios!");
    let greenroof = await submitGreenRoof(state.greenroof);
    if (!greenroof) return;
    setGreenRoofId(greenroof.id);
    submitReservoir(state?.reservoir, greenroof.id);
    submitImages(state?.images?.toAdd, greenroof.id);
    setSuccessfullySubmitted(true);

  }

  if (successfullySubmitted) {
    return <SuccessScreen detailsUrl={`/green-roof/${greenRoofId}`} />
  }

  if (isPickingLocation) {
    return (
      <MapPicker 
        marker={{lat: state?.greenroof?.latitude, lng: state?.greenroof?.longitude}} 
        onConfirm={setLocation} 
        onExit={() => {setIsPickingLocation(false)}}
      />
    )
  }
  
  return (
    <>
      <ActionBar/>
      <Container>
        <div className={styles.header}>
          <h1>Adicionar Telhado</h1>
          <p>Contribua para a expansão do catálogo de telhados já registrados na região da cidade do Recife!</p>
        </div>
        <div className={styles.infos}>
          <Tabs defaultValue="Informações">
            <Tabs.List>
              <Tabs.Trigger value="Informações">Informações</Tabs.Trigger>
              <Tabs.Trigger value="Reservatório">Reservatório</Tabs.Trigger>
              <Tabs.Trigger value="Imagens">Imagens</Tabs.Trigger>
              <Tabs.Trigger value="Salvar">Salvar</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="Informações">
              <TechnicalSection 
                data={state?.greenroof} 
                handleChange={onGreenRoofChange} 
                handleVegetationChange={onVegetationChange} 
                onSelectMap={() => setIsPickingLocation(true)} 
                handleActualLocation={actualLocation} 
              />
            </Tabs.Content>
            <Tabs.Content value="Reservatório">
              <ReservoirSection 
                data={state?.reservoir} 
                handleChangeReservoir={onReservoirChange} 
              />
            </Tabs.Content>
            <Tabs.Content value="Imagens">
              <ImageSection 
                images={state?.images ?? []} 
                addImage={addImage} 
                removeImage={removeImage} 
              />
            </Tabs.Content>
            <Tabs.Content value="Salvar">
              <SaveSection handleSubmit={submit} />
            </Tabs.Content>
          </Tabs>
        </div>
      </Container>
    </>
  );
}