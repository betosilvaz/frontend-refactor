import styles from "./SuccessScreen.module.css";

import { Link } from "react-router";

import SuccessIcon from '@components/icons/SuccessIcon';

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