import styles from './SideBar.module.css'

import { createPortal } from 'react-dom'
import { Link } from 'react-router';

export default function SideBar({ onClose }) {
  return createPortal((
    <div className={styles.overlay} onClick={() => onClose()}>
      <aside className={styles.sidebar} onClick={e => e.stopPropagation()}>
        <h1>Menu</h1>
        <ul className={styles.links}>
          <li><Link to="/profile">Conta</Link></li>
          <li><Link to="/green-roof/create">Registrar novo telhado</Link></li>
          <li><Link to="/reports">Relatórios</Link></li>
          <li><Link to="/notifications">Alertas</Link></li>
          <li><Link to="/logout">Sair</Link></li>
        </ul>
      </aside>
    </div>
  ), document.body);
}