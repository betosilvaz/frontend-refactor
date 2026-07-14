import styles from "./SuccessScreen.module.css";

import { Link } from "react-router";

import { Check as SuccessIcon } from 'lucide-react';

function SuccessScreen({ detailsUrl }) {
  return (
    <div className={styles.successScreen}>
      <span className={styles.successIcon}><SuccessIcon /></span>
      <p>Dados atualizados com sucesso!</p>
      <Link to={detailsUrl}>Ver Detalhes</Link>
      <Link to="/">Inicio</Link>
    </div>
  );
}

export default SuccessScreen;