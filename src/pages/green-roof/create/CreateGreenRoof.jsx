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

import { useEffect, useState, useReducer, useRef } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";

function stateReducer(state, action) {
  switch (action.type) {
    case "set-location":
      return {
        ...state,
        greenroof: {
          ...state.greenroof,
          latitude: action?.latitude || state?.greenroof?.latitude,
          longitude: action?.longitude || state?.greenroof?.longitude,
          address: action?.address || state?.greenroof?.address || null,
        }
      }
    case "on-greenroof-change":
      return {
        ...state,
        greenroof: {
          ...state.greenroof,
          [action.name]: action.value
        }
      }
    case "on-reservoir-change":
      return {
        ...state,
        reservoir: {
          ...state.reservoir,
          [action.name]: action.value
        }
      }
    case "on-vegetation-change":
      return {
        ...state,
        greenroof: {
          ...state.greenroof,
          vegetation: action.tags
        }
      }
    case "add-image":
      return {
        ...state,
        images: {
          ...state?.images,
          toAdd: [
            ...state?.images?.toAdd,
            action.image
          ]
        }
      }
    case "remove-image":
      // Se a imagem tiver um ID, ela já existe no banco de dados (original)
      const isExistingImage = action.image && action.image.id;

      if (isExistingImage) {
        return {
          ...state,
          images: {
            ...state.images,
            // Remove da lista de exibição (original)
            original: state.images.original.filter((img) => img.id !== action.image.id),
            // Adiciona à lista de IDs que serão deletados no backend
            toRemove: [...state.images.toRemove, action.image.id]
          }
        };
      }

      // Se não tem ID, é uma imagem recém-adicionada (Blob/File) que ainda não foi salva
      return {
        ...state,
        images: {
          ...state.images,
          // Filtramos pelo índice ou pelo próprio objeto de arquivo
          toAdd: state.images.toAdd.filter((_, index) => index !== action.index)
        }
      };
    default:
      return state;
  }
}

export default function CreateGreenRoof() {
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [tab, setTab] = useState(1);
  const [state, dispatch] = useReducer(stateReducer, {
    greenroof: {},
    reservoir: {},
    images: {
      toAdd: [],
      toRemove: [],
      original: []
    }
  });

  function actualLocation() {
    if (!navigator.geolocation) return toast.error("Geolocalização não é suportada pelo seu navegador!");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude, 
          longitude: position.coords.longitude 
        };
        setLocation(coords);
      }, (error) => {
        toast.error("Não foi possível obter sua localização atual. Por favor, selecione manualmente no mapa.");
      }
    );
  }

  function setLocation(coords) {
    if (coords == undefined) return;

    const options = { headers: { "User-Agent": "greenroof/0.1" } };
    const enpoint = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`;
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
    const { name, value } = e.target;
    dispatch({ type: "on-greenroof-change", name, value });
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
    let greenroof = await submitGreenRoofData(state.greenroof);
    if (!greenroof) return;
    submitReservoirData(state.reservoir, greenroof.id);
    submitImages(state?.images?.toAdd, greenroof.id);
  }

  let tabOptions = [
    "Informações",
    "Reservatório",
    "Imagens",
    "Salvar"
  ]

  if (isPickingLocation) return <MapPicker marker={{lat: state?.greenroof?.latitude, lng: state?.greenroof?.longitude}} onConfirm={setLocation} onExit={() => {setIsPickingLocation(false)}} />

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
            {tab === 1 && <TechnicalSection data={state?.greenroof} handleChange={onGreenRoofChange} handleVegetationChange={onVegetationChange} onSelectMap={() => setIsPickingLocation(true)} handleActualLocation={actualLocation} />}
            {tab === 2 && <ReservoirSection data={state?.reservoir} handleChangeReservoir={onReservoirChange} />}
            {tab === 3 && <ImageSection images={state?.images ?? []} addImage={addImage} removeImage={removeImage} />}
            {tab === 4 && <SaveSection handleSubmit={submit} />}
          </div>
        </div>
      </Container>
    </>
  );
}

function SuccessScreen() {
  return (
    <div className={styles.successScreen}>
      <span className={styles.successIcon}><SuccessIcon/></span>
      <p>Telhado cadastrado com sucesso!</p>
      <Link to="/">Inicio</Link>
    </div>
  );
}

function submitGreenRoofData(payload) {
  let options = {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("jwt"),
    },
    body: JSON.stringify(payload),
  };
  return fetch("http://localhost:8080/api/green-roofs", options)
    .then(res => {
      if (!res.ok) throw new Error("Erro ao cadastrar telhado!");
      toast.success("Telhado cadastrado com sucesso!");
      return res.json();
    })
    .then(data => {
      return data;
    })
    .catch(err => {
      toast.error("Erro ao cadastrar telhado!");
      console.log(err);
      return false;
    });
}

function submitReservoirData(data, greenRoofId) {
  const payload = { ...data, greenRoofId };
  const endpoint = "http://localhost:8080/api/reservoirs";
  const options = {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("jwt"), 
    },
    body: JSON.stringify(payload),
  };
  return fetch(endpoint, options)
    .then(res => {
      if (!res.ok) throw new Error("Erro ao cadastrar reservatório!");
      return res.json();
    })
    .then(data => {
      toast.success("Reservatório cadastrado com sucesso!");
    })
    .catch(err => {
      toast.error("Erro ao cadastrar reservatório!");
      console.error(err);
    });
}

function submitImages(images, greenRoofId) {
  let formData = new FormData();
  images.forEach(file => {
    formData.append("images", file);
  });
  formData.append("greenRoofId", greenRoofId);
  const endpoint = "http://localhost:8080/api/images";
  const options = {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("jwt"), 
    },
    body: formData,
  };
  return fetch(endpoint, options)
    .then(res => {
      if (!res.ok) throw new Error("Erro ao salvar as imagens!");
      return res.json();
    })
    .then(data => {
      toast.success("Imagens salvas com sucesso!");
    })
    .catch(err => {
      toast.error("Erro ao salvar as imagens!");
      console.error(err);
    });
}