import styles from "./UpdateGreenRoof.module.css"

import Tabs from "@components/tabs/Tabs.jsx"
import ActionBar from '@components/action-bar/ActionBar'
import TechnicalSection from "./components/technical-section/TechnicalSection.jsx"
import ReservoirSection from "./components/reservoir-section/ReservoirSection.jsx"
import ImageSection from "./components/image-section/ImageSection.jsx"
import SaveSection from "./components/save-section/SaveSection.jsx"
import SuccessScreen from "./components/success-screen/SuccessScreen.jsx"
import Container from '@components/container/Container'
import MapPicker from "@components/map-picker/MapPicker"

import useSubmit from "./hooks/useSubmit.js";
import useGreenRoofForm from "./hooks/useGreenRoofForm.js"
import ContextProvider from "./providers/ContextProvider.jsx"

import { useParams } from "react-router";

export default function UpdateGreenRoof() {
  const { id } = useParams();
  const form = useGreenRoofForm(id);
  const submit = useSubmit();

  if (form.successfullySubmitted) {
    return <SuccessScreen detailsUrl={"/green-roof/" + id} />
  }

  if (form.isPickingLocation) {
    return (
      <MapPicker 
        marker={{ lat: form.state?.greenroof?.latitude, lng: form.state?.greenroof?.longitude }} 
        onConfirm={form.setLocation} 
        onExit={() => { form.setIsPickingLocation(false) }} 
      />
    );
  }

  return (
    <ContextProvider {...form}>
      <ActionBar />
      <Container>
        <div className={styles.header}>
          <h1>Atualizar dados</h1>
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
              <TechnicalSection />
            </Tabs.Content>
            <Tabs.Content value="Reservatório">
              <ReservoirSection />
            </Tabs.Content>
            <Tabs.Content value="Imagens">
              <ImageSection />
            </Tabs.Content>
            <Tabs.Content value="Salvar">
              <SaveSection handleSubmit={submit} />
            </Tabs.Content>
          </Tabs>
        </div>
      </Container>
    </ContextProvider>
  );
}