import styles from "./ReservoirSection.module.css";
import { motion } from "framer-motion";

import FormGroup from '@components/form-group/FormGroup'
import Input from '@components/input/Input'
import ResponsiveRow from '@components/responsive-row/ResponsiveRow'
import Select from '@components/select/Select'
import { useUpdateGreenRoofContext } from "../../providers/ContextProvider";

export default function ReservoirSection() {
  const { state, dispatch } = useUpdateGreenRoofContext();
  const data = state?.reservoir;

  function handleChange(e) {
    const { name, value } = e.target;
    dispatch({ type: "on-reservoir-change", name, value });
  }

  const typeOptions = [
    { name: 'Acúmulo', value: 'ACUMULO' },
    { name: 'Retardo', value: 'RETARDO' }
  ];

  return (
    <motion.form 
      className={styles.reservoirForm}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <section className={styles.cardSection}>
        <div className={styles.sectionHeader}>
          <h2>Configuração do Reservatório</h2>
          <p>Preencha os dados abaixo caso o telhado verde possua um sistema de armazenamento de água (Opcional).</p>
        </div>
        
        <div className={styles.formGrid}>
          <input type="hidden" name="id" value={data?.id} />
          <ResponsiveRow>
            <FormGroup>
              <label htmlFor="name">Identificação do Reservatório</label>
              <Input type="text" name="name" placeholder="Ex: Tanque Principal Sul" value={data?.name ?? ""} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <label htmlFor="material">Material de Construção</label>
              <Input type="text" name="material" placeholder="Ex: Fibra de vidro, concreto..." value={data?.material ?? ""} onChange={handleChange}/>
            </FormGroup>
          </ResponsiveRow>
          <ResponsiveRow>
            <FormGroup>
              <label htmlFor="type">Tipo de Sistema</label>
              <Select value={data?.type ?? ""} name="type" options={typeOptions} onSelect={handleChange} />
            </FormGroup>
            <FormGroup>
              <label htmlFor="capacity">Capacidade Total (Litros)</label>
              <Input name="capacity" type="number" placeholder="Ex: 5000" value={data?.capacity ?? ""} onChange={handleChange} />
            </FormGroup>
          </ResponsiveRow>
          <FormGroup>
            <label htmlFor="useCase">Finalidade e Casos de Uso</label>
            <textarea 
              className={styles.textarea} 
              name="useCase" 
              placeholder="Descreva para onde essa água é direcionada (ex: irrigação do próprio telhado, reuso em sanitários...)" 
              value={data?.useCases ?? ""} 
              onChange={handleChange}
            ></textarea>
          </FormGroup>
        </div>
      </section>
    </motion.form>
  );
}