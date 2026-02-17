import styles from "./SaveSection.module.css";

export default function SaveSection({ handleSubmit }) {

  return (
    <div className={styles.saveButton}>
      <h3>Tem certeza que deseja salvar o telhado?</h3>
      <button type="button" onClick={handleSubmit}>Salvar Telhado</button>
    </div>
  );

}