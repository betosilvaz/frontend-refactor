import styles from "./TechnicalSection.module.css";

import TagInput from "@components/tag-input/TagInput";
import ResponsiveRow from '@components/responsive-row/ResponsiveRow'
import Input from '@components/input/Input'
import Select from '@components/select/Select'
import FormGroup from '@components/form-group/FormGroup'
import Checkbox from "@components/checkbox/Checkbox";
import { useUpdateGreenRoofContext } from "../../providers/ContextProvider";
import { useCallback } from "react";

import { motion } from "motion/react";

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function TechnicalSection() {
  const { state, dispatch, setIsPickingLocation, actualLocation } = useUpdateGreenRoofContext();
  const data = state || {};
  const vegData = state?.vegetation || { originals: [], toAdd: [] };
  const combinedVegetation = [
    ...vegData.originals, 
    ...vegData.toAdd
  ];

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const finalValue = type === "checkbox" ? checked : value;
    dispatch({ type: "on-greenroof-change", name, value: finalValue });
  }


  const handleVegetationChange = useCallback((tags) => {
    dispatch({ type: "on-vegetation-change", tags });
  }, [dispatch]);

  const handleVegetationDelete = useCallback((id) => {
    dispatch({ type: "remove-vegetation-original", tagId: id });
  }, [dispatch]);

  function onSelectMap() {
    setIsPickingLocation(true)
  }

  function handleActualLocation() {
    actualLocation();
  }

  const typeOptions = [
    { name: 'Intensivo', value: 'INTENSIVO' },
    { name: 'Semi-Intensivo', value: 'SEMI_INTENSIVO'},
    { name: 'Extensivo', value: 'EXTENSIVO' }
  ]

  const situationOptions = [
    { name: 'Habite-se', value: 'HABITE_SE' },
    { name: 'Iniciada', value: 'INICIADO' },
    { name: 'Não iniciada', value: 'NAO_INICIADO' }
  ]

  return (
    <motion.form 
      className={styles.technicalDataForm} 
      onSubmit={(e) => e.preventDefault()}
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <motion.section variants={fadeUp} className={styles.cardSection}>
        <div className={styles.sectionHeader}>
          <h2>Informações Básicas</h2>
          <p>Dados gerais de identificação e localização do telhado.</p>
        </div>
        
        <div className={styles.formGrid}>
          <ResponsiveRow>
            <FormGroup>
              <label htmlFor="name">Nome <Required/></label>
              <Input type="text" name="name" placeholder="Ex: Edifício Cobertura Principal" value={data?.name ?? ""} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <label htmlFor="situation">Situação</label>
              <Select value={data?.situation ?? ""} name="situation" options={situationOptions} onSelect={handleChange}/>
            </FormGroup>
          </ResponsiveRow>
          <ResponsiveRow>
            <FormGroup>
              <label htmlFor="type">Tipo</label>
              <Select value={data?.type ?? ""} name="type" options={typeOptions} onSelect={handleChange} />
            </FormGroup>
            <FormGroup>
              <label htmlFor="conclusion">Ano de Conclusão</label>
              <Input type="number" name="conclusion" placeholder="Ex: 2020" value={data?.conclusion ?? ""} onChange={handleChange} />
            </FormGroup>
          </ResponsiveRow>
          <ResponsiveRow>
            <FormGroup>
              <label htmlFor="area">Área Total (m²)</label>
              <Input type="number" name="area" placeholder="Ex: 150" value={data?.area ?? ""} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <label htmlFor="address">Endereço <Required/></label>
              <Input type="text" name="address" placeholder="Ex: Recife, PE" value={data?.address ?? ""} onChange={handleChange} />
            </FormGroup>
          </ResponsiveRow>
          
          <div className={styles.mapControlsContainer}>
            <ResponsiveRow>
              <FormGroup>
                <label htmlFor="latitude">Latitude <Required/></label>
                <Input type="text" name="latitude" value={data?.latitude ?? ""} onChange={handleChange} />
              </FormGroup>
              <FormGroup>
                <label htmlFor="longitude">Longitude <Required/></label>
                <Input type="text" name="longitude" value={data?.longitude ?? ""} onChange={handleChange} />
              </FormGroup>
            </ResponsiveRow>
            <div className={styles.mapActions}>
              <button type="button" className={styles.mapButton} onClick={() => setIsPickingLocation(true)}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Abrir Mapa Interativo
              </button>
              <button type="button" className={styles.actualLocationButton} onClick={actualLocation}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Usar Minha Localização
              </button>
            </div>
          </div>

          <FormGroup>
            <label htmlFor="description">Descrição do Projeto</label>
            <textarea className={styles.textarea} name="description" value={data?.description ?? ""} placeholder="Descreva os detalhes e características marcantes deste telhado verde..." onChange={handleChange}></textarea>
          </FormGroup>
          
          <div className={styles.checkboxGroup}>
            <Checkbox label="Acesso permitido ao público/moradores?" name="isAccessible" checked={data?.isAccessible || false} onChange={handleChange} />
            <Checkbox label="Implementação obrigatória por lei?" name="isMandatory" checked={data?.isMandatory || false} onChange={handleChange} />
          </div>
        </div>
      </motion.section>

      <motion.section variants={fadeUp} className={styles.cardSection}>
        <div className={styles.sectionHeader}>
          <h2>Especificações Técnicas</h2>
        </div>
        <div className={styles.formGrid}>
          <ResponsiveRow>
            <FormGroup>
              <label htmlFor="depth">Profundidade do Substrato (cm)</label>
              <Input type="number" name="depth" placeholder="Ex: 15" value={data?.depth ?? ""} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <label htmlFor="weight">Peso por m² (kg)</label>
              <Input type="number" name="weight" placeholder="Ex: 200" value={data?.weight ?? ""} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <label htmlFor="slope">Inclinação (°)</label>
              <Input type="number" name="slope" placeholder="Ex: 2" value={data?.slope ?? ""} onChange={handleChange} />
            </FormGroup>
          </ResponsiveRow>
          <FormGroup>
            <label htmlFor="vegetation">Tipos de Vegetação</label>
            <TagInput name="vegetation" value={combinedVegetation} onChange={handleVegetationChange} onTagDelete={handleVegetationDelete} />
          </FormGroup>
        </div>
      </motion.section>

      <motion.section variants={fadeUp} className={styles.cardSection}>
        <div className={styles.sectionHeader}>
          <h2>Contato do Responsável</h2>
        </div>
        <div className={styles.formGrid}>
          <ResponsiveRow>
            <FormGroup>
              <label htmlFor="ownerName">Nome Completo</label>
              <Input type="text" name="ownerName" placeholder="Ex: João da Silva" value={data?.ownerName ?? ""} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <label htmlFor="ownerEmail">Email</label>
              <Input type="email" name="ownerEmail" placeholder="joao@exemplo.com" value={data?.ownerEmail ?? ""} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <label htmlFor="ownerNumber">Telefone</label>
              <Input type="text" name="ownerNumber" placeholder="(81) 90000-0000" value={data?.ownerNumber ?? ""} onChange={handleChange} />
            </FormGroup>
          </ResponsiveRow>
        </div>
      </motion.section>
    </motion.form>
  );
}

function Required() {
  return (
    <span className={styles.required}>*</span>
  )
}