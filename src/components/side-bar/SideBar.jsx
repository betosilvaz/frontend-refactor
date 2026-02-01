import styles from './SideBar.module.css'

import { createPortal } from 'react-dom'
import { Link } from 'react-router';
import { useAuth } from '@providers/AuthProvider';

export default function SideBar({ onClose }) {
  const { isAuthenticated, logout } = useAuth();

  return createPortal((
    <div className={styles.overlay} onClick={() => onClose()}>
      <aside className={styles.sidebar} onClick={e => e.stopPropagation()}>
        <h1>Menu</h1>
        <ul className={styles.links}>
          {isAuthenticated ? (
            <>
              <li><Link to="/profile">Conta</Link></li>
              <li><Link to="/green-roof/create">Registrar novo telhado</Link></li>
              <li><Link to="/reports">Relatórios</Link></li>
              <li><Link to="/notifications">Alertas</Link></li>
              <li><Link onClick={() => logout()}>Sair</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Entrar</Link></li>
              <li><Link to="/register">Cadastro</Link></li>
            </>
          )}
        </ul>
      </aside>
    </div>
  ), document.body);
}