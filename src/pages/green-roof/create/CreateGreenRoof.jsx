import styles from "./CreateGreenRoof.module.css"

import Tabs from "@components/tabs/Tabs.jsx"
import ActionBar from '@components/action-bar/ActionBar'
import TechnicalSection from "./technical-section/TechnicalSection"
import ReservoirSection from "./reservoir-section/ReservoirSection"
import ImageSection from "./image-section/ImageSection"
import SaveSection from "./save-section/SaveSection"
import SuccessIcon from '@components/icons/SuccessIcon'
import Container from '@components/container/Container'
import MapPicker from "@components/map-picker/MapPicker"

import { useEffect, useState, useReducer } from "react";
import { Link } from "react-router";

function inputReducer(state, action) {
  const { name, value } = action.element.target;
  switch (action.type) {
    case 'green-roof-change':
      return {
        ...state, 
        roof: {
          ...state.roof, 
          [name]: value
        }
      }
      break;
    case 'reservoir-change':
      return {
        ...state, 
        reservoir: {
          ...state.reservoir,
          [name]: value
        }
      }
      break;
    case 'vegetation-change':

      const tags = JSON.parse(e.detail.value || "[]").map(t => t.value);
      return {
        ...state,
        roof: {
          ...state.roof, 
          vegetation: tags
        }
      }
      break;
  }
}

export default function CreateGreenRoof() {

  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [tab, setTab] = useState(1);

  const [images, setImages] = useState([]);
  const [form, setForm] = useState({
    name: "",
    type: "",
    conclusion: "",
    area: "",
    latitude: "",
    longitude: "",
    address: "",
    description: "",
    depth: "",
    weight: "",
    slope: "",
    vegetation: [],
    ownerName: "",
    ownerEmail: "",
    ownerNumber: "",
  });
  const [reservoirForm, setReservoirForm] = useState({
    name: "",
    type: "",
    capacity: "",
    useCase: "",
  })

  const [forms, dispatch] = useReducer(inputReducer, {});

  function handleActualLocation() {
    if (!navigator.geolocation) return alert("Geolocalização não suportada");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`, { headers: { "User-Agent": "greenroof/0.1" } })
          .then((response) => response.json())
          .then((data) => {
            setForm({
              ...form,
              latitude: latitude,
              longitude: longitude,
              address: data.display_name,
            });
          })
      }, (error) => {
        console.log("Erro: ", error);
      }
    );
  }

  async function handleSetLocation(coords) {
    if (coords == undefined) return;

    let response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`);
    let data = await response.json();
    setForm({
      ...form,
      latitude: coords.lat,
      longitude: coords.lng,
      address: data.display_name,
    });
    setIsPickingLocation(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleChangeReservoir(e) {
    const { name, value } = e.target;
    setReservoirForm(prev => ({ ...prev, [name]: value }));
  }

  const handleVegetationChange = (e) => {
    const tags = JSON.parse(e.detail.value || "[]").map(t => t.value);
    setForm(prev => ({ ...prev, vegetation: tags }));
  };

  async function handleSubmit() {
    let response = await handleSubmitGreenRoofData();
    if (!response) throw new Error("Erro no salvamento do telhado! ");
    await handleSubmitReservoirData(response.id);
    await handleSubmitImages(response.id);
    setSuccess(true);
    console.log(form);
  }

  async function handleSubmitGreenRoofData() {
    let payload = { ...form };
    try {
      const response = await fetch("http://localhost:8080/api/greenroofs", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      let data = await response.json();

      if (!response.ok) {
        if (!data.error) setError("Algo deu errado!");
        else setError(data.error);
        throw new Error("Erro ao salvar dados do telhado!");
      }
      return data;
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmitReservoirData(greenRoofId) {
    let payload = { ...reservoirForm, greenRoofId: greenRoofId };
    try {
      const response = await fetch("http://localhost:8080/api/reservoirs", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok)
        throw new Error("Erro ao salvar reservatório!");
      console.log("Reservatório salvo com sucesso!");
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmitImages(greenRoofId) {
    let formData = new FormData();
    images.forEach(file => formData.append("images", file));
    formData.append("greenRoofId", greenRoofId);
    try {
      const response = await fetch("http://localhost:8080/api/images", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!response.ok)
        throw new Error("Erro ao salvar as imagens!");
      console.log("Imagens salvas com sucesso!");
    } catch (err) {
      console.error(err);
    }
  }

  let tabOptions = [
    "Informações",
    "Reservatório",
    "Imagens",
    "Salvar"
  ]

  if (success) {
    return (
      <div className={styles.successScreen}>
        <span className={styles.successIcon}><SuccessIcon/></span>
        <p>Telhado cadastrado com sucesso!</p>
        <Link to="/">Inicio</Link>
      </div>
    );
  }

  if (isPickingLocation) {
    return <MapPicker onConfirm={handleSetLocation} onExit={() => {}} />
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
          <Tabs changeTab={(tabNumber) => setTab(tabNumber)} actual={tab} options={tabOptions} />
          <div className={styles.forms}>
            {tab === 1 && <TechnicalSection data={form} handleChange={handleChange} handleVegetationChange={handleVegetationChange} onSelectMap={() => setIsPickingLocation(true)} handleActualLocation={handleActualLocation} />}
            {tab === 2 && <ReservoirSection data={reservoirForm} handleChangeReservoir={handleChangeReservoir} />}
            {tab === 3 && <ImageSection images={images} setImages={setImages} />}
            {tab === 4 && <SaveSection handleSubmit={handleSubmit} />}
          </div>
        </div>
      </Container>
    </>
  );
}

function validateForm(form) {
  if (!form.name) return false;
  if (!form.type) return false;
  if (!form.address) return false;
  if (!form.latitude) return false;
  if (!form.longitude) return false;
}