import styles from "./ReservoirSection.module.css";

import FormGroup from '@components/form-group/FormGroup'
import Input from '@components/input/Input'
import ResponsiveRow from '@components/responsive-row/ResponsiveRow'
import Select from '@components/select/Select'
import { useCreateGreenRoofContext } from "../../providers/ContextProvider";

export default function ReservoirSection() {
  const { state, dispatch } = useCreateGreenRoofContext();
  const data = state?.reservoir;

  function handleChange(e) {
    const { name, value } = e.target;
    dispatch({ type: "on-reservoir-change", name, value });
  }

  const typeOptions = [
    { name: 'Acúmulo', value: 'ACUMULO' },
    { name: 'Retardo', value: 'RETARDO' }
  ]

  return (
    <form className={styles.reservoirForm}>
      <section className={styles.formSection}>
        <h2 className={styles.sectionHeader}>Informações do reservatório (Opcional)</h2>
        <ResponsiveRow>
          <FormGroup>
            <label htmlFor="name">Nome do Reservatório</label>
            <Input type="text" name="name" placeholder="EX: Reservatório X" value={data?.name ?? ""} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <label htmlFor="material">Material</label>
            <Input type="text" name="material" placeholder="Ex: plástico, concreto..." value={data?.material ?? ""} onChange={handleChange}/>
          </FormGroup>
        </ResponsiveRow>
        <ResponsiveRow>
          <FormGroup>
            <label htmlFor="type">Tipo</label>
            <Select value={data?.type ?? ""} name="type" options={typeOptions} onSelect={handleChange} />
          </FormGroup>
          <FormGroup>
            <label htmlFor="capacity">Capacidade do Reservatório (Em Litros)</label>
            <Input name="capacity" type="number" placeholder="Ex: 3000" value={data?.capacity ?? ""} onChange={handleChange} />
          </FormGroup>
        </ResponsiveRow>
        <FormGroup>
          <label htmlFor="useCase">Casos de Uso da Água</label>
          <textarea className={styles.textarea} name="useCase" placeholder="Descreva a finalidade para a qual a água acumulada é utilizada..." value={data?.useCase ?? ""} onChange={handleChange}></textarea>
        </FormGroup>
      </section>
    </form>
  );
}