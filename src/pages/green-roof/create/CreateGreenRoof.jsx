import styles from "./CreateGreenRoof.module.css"

import Tabs from "@components/tabs/Tabs.jsx"
import ActionBar from '@components/action-bar/ActionBar'
import TechnicalSection from "./components/technical-section/TechnicalSection"
import ReservoirSection from "./components/reservoir-section/ReservoirSection"
import ImageSection from "./components/image-section/ImageSection"
import SaveSection from "./components/save-section/SaveSection"
import Container from '@components/container/Container'
import MapPicker from "@components/map-picker/MapPicker"

import useSubmit from "./hooks/useSubmit.js"
import useGreenRoofForm from "./hooks/useGreenRoofForm.js"
import ContextProvider from "./providers/ContextProvider.jsx"
import { motion } from "motion/react"

export default function CreateGreenRoof() {
  const submit = useSubmit();
  const form = useGreenRoofForm();


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
              Cultive um novo <br/>
              <span className={styles.highlight}>Telhado Verde</span>
            </h1>
            
            <p>
              Ajude a transformar a paisagem urbana do Recife. Cada telhado registrado 
              é um passo em direção a uma cidade mais sustentável, fresca e conectada com a natureza!
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