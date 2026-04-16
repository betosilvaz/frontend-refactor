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
import { motion } from "framer-motion"

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
        marker={{ lat: form.state?.latitude, lng: form.state?.longitude }} 
        onConfirm={form.setLocation} 
        onExit={() => { form.setIsPickingLocation(false) }} 
      />
    );
  }

  return (
    /* Novo wrapper para dar vida ao fundo inteiro da página */
    <div className={styles.pageWrapper}>
      <ContextProvider {...form}>
        <ActionBar/>
        <Container>
          <motion.div 
            className={styles.header}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Novo Badge e Copy */}
            <span className={styles.badge}>Mapeamento Verde</span>
            
            <h1>
              Cuide de um <br/>
              <span className={styles.highlight}>Telhado Verde</span>
            </h1>
            
            <p>
              Atualize os dados do seu telhado verde e ajude a manter Recife mais sustentável, fresca e conectada com a natureza. Cada informação registrada fortalece o planejamento urbano, valoriza as áreas verdes e contribui para uma cidade mais resiliente. 
            </p>
          </motion.div>
          
          <motion.div 
            className={styles.infos}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Tabs defaultValue="Informações">
              <div className={styles.tabsWrapper}>
                <Tabs.List>
                  <Tabs.Trigger value="Informações">Informações</Tabs.Trigger>
                  <Tabs.Trigger value="Reservatório">Reservatório</Tabs.Trigger>
                  <Tabs.Trigger value="Imagens">Imagens</Tabs.Trigger>
                  <Tabs.Trigger value="Salvar">Salvar</Tabs.Trigger>
                </Tabs.List>
              </div>
              
              <div className={styles.tabContentArea}>
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
                  <SaveSection handleSubmit={() => submit(form.state)} />
                </Tabs.Content>
              </div>
            </Tabs>
          </motion.div>
        </Container>
      </ContextProvider>
    </div>
  );
}