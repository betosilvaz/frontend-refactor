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
import useGreenRoofForm from "./hooks/useGreenRoofForm.js"
import ContextProvider from "./providers/ContextProvider.jsx"

export default function CreateGreenRoof() {
  const submit = useSubmit();
  const form = useGreenRoofForm();

  if (form.successfullySubmitted) return <SuccessScreen />;

  if (form.isPickingLocation) {
    return (
      <MapPicker 
        marker={{lat: form.state?.latitude, lng: form.state?.longitude}} 
        onConfirm={form.setLocation} 
        onExit={() => {form.setIsPickingLocation(false)}}
      />
    )
  }
  
  return (
    <ContextProvider {...form}>
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
              <TechnicalSection />
            </Tabs.Content>
            <Tabs.Content value="Reservatório">
              <ReservoirSection />
            </Tabs.Content>
            <Tabs.Content value="Imagens">
              <ImageSection />
            </Tabs.Content>
            <Tabs.Content value="Salvar">
              <SaveSection handleSubmit={ () => submit(form.state) } />
            </Tabs.Content>
          </Tabs>
        </div>
      </Container>
    </ContextProvider>
  );
}