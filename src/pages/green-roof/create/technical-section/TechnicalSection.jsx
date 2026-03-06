import styles from "./TechnicalSection.module.css";

import TagInput from "@components/tag-input/TagInput";
import ResponsiveRow from '@components/responsive-row/ResponsiveRow'
import Input from '@components/input/Input'
import Select from '@components/select/Select'
import FormGroup from '@components/form-group/FormGroup'


export default function TechnicalSection({ data, handleChange, handleVegetationChange, onSelectMap, handleActualLocation }) {

  const typeOptions = [
    { name: 'intensivo', value: 'intensivo' },
    { name: 'semi-intensivo', value: 'semi-intensivo'},
    { name: 'extensivo', value: 'extensivo' }    
  ]

  return (
    <form className={styles.technicalDataForm} onSubmit={(e) => e.preventDefault()}>
      <section className={styles.formSection}>
        <h2 className={styles.sectionHeader}>Informações do Telhado Verde</h2>
        <ResponsiveRow>
          <FormGroup>
            <label htmlFor="name">Nome</label>
            <Input type="text" name="name" placeholder="Ex: Edificio Cobertura Principal" value={data?.name ?? ""} onChange={handleChange} />
          </FormGroup>
        </ResponsiveRow>
        <ResponsiveRow>
          <FormGroup>
            <label htmlFor="type">Tipo</label>
            <Select value={data?.type ?? ""} options={typeOptions} onSelect={handleChange} />
          </FormGroup>
          <FormGroup>
            <label htmlFor="conclusion">Data de Conclusão</label>
            <Input type="number" name="conclusion" placeholder="Ex: 2020" value={data?.conclusion ?? ""} onChange={handleChange} />
          </FormGroup>
        </ResponsiveRow>
        <ResponsiveRow>
          <FormGroup>
            <label htmlFor="area">Área Total (m²)</label>
            <Input type="number" name="area" placeholder="Ex: 150" value={data?.area ?? ""} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <label htmlFor="address">Endereço</label>
            <Input type="text" name="address" placeholder="Ex: Recife, PE" value={data?.address ?? ""} onChange={handleChange} />
          </FormGroup>
        </ResponsiveRow>
        <ResponsiveRow>
          <FormGroup>
            <label htmlFor="latitude">Latitude</label>
            <Input type="text" name="latitude" value={data?.latitude ?? ""} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <label htmlFor="longitude">Longitude</label>
            <Input type="text" name="longitude" value={data?.longitude ?? ""} onChange={handleChange} />
          </FormGroup>
        </ResponsiveRow>
        <ResponsiveRow>
          <button type="button" className={styles.mapButton} onClick={onSelectMap}>Mapa Interativo</button>
          <button type="button" className={styles.actualLocationButton} onClick={handleActualLocation}>Localização Atual</button>
        </ResponsiveRow>
        <FormGroup>
          <label htmlFor="description">Descrição do Projeto</label>
          <textarea className={styles.textarea} name="description" placeholder="Descreva o telhado verde" onChange={handleChange}></textarea>
        </FormGroup>
      </section>
      <section className={styles.formSection}>
        <h2 className={styles.sectionHeader}>Dados técnicos</h2>
        <ResponsiveRow>
          <FormGroup>
            <label htmlFor="depth">Profundidade do Substrato (cm)</label>
            <Input type="number" name="depth" placeholder="Ex: 120" value={data?.depth ?? ""} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <label htmlFor="weight">Peso por m² (Em Kg)</label>
            <Input type="number" name="weight" placeholder="Ex: 200" value={data?.weight ?? ""} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <label htmlFor="slope">Inclinação (Em graus)</label>
            <Input type="number" name="slope" placeholder="Ex: 2" value={data?.slope ?? ""} onChange={handleChange} />
          </FormGroup>
        </ResponsiveRow>
        <ResponsiveRow>
          <FormGroup>
            <label htmlFor="vegetation">Vegetação</label>
            <TagInput name="vegetation" value={data?.vegetation ?? []} onChange={handleVegetationChange} />
          </FormGroup>
        </ResponsiveRow>
      </section>
      <section className={styles.formSection}>
        <h2 className={styles.sectionHeader}>Informações do Proprietário</h2>
        <ResponsiveRow>
          <FormGroup>
            <label htmlFor="ownerName">Nome do Responsável</label>
            <Input type="text" name="ownerName" placeholder="Nome Completo" value={data?.ownerName ?? ""} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <label htmlFor="ownerEmail">Email</label>
            <Input type="email" name="ownerEmail" placeholder="email@exemplo.com" value={data?.ownerEmail ?? ""} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <label htmlFor="ownerNumber">Telefone</label>
            <Input type="text" name="ownerNumber" placeholder="(11) 99999-9999" value={data?.ownerNumber ?? ""} onChange={handleChange} />
          </FormGroup>
        </ResponsiveRow>
      </section>
    </form>
  );
}