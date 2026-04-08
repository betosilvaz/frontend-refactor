import styles from "./SaveSection.module.css";
import { motion } from "framer-motion";

export default function SaveSection({ handleSubmit }) {
  return (
    <motion.div 
      className={styles.saveContainer}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.iconWrapper}>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
      </div>
      
      <h3>Pronto para registrar este telhado?</h3>
      <p>Revise as informações nas abas anteriores. Ao salvar, os dados serão enviados para o servidor e o telhado ficará visível no mapa principal.</p>
      
      <button type="button" className={styles.submitButton} onClick={handleSubmit}>
        Confirmar e Salvar Telhado
      </button>
    </motion.div>
  );
}