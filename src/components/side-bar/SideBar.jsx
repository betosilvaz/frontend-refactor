import styles from './SideBar.module.css';

import { Link, useLocation } from 'react-router';
import { 
  Leaf, 
  User, 
  PlusCircle, 
  FileText, 
  Bell, 
  Info, 
  LogOut, 
  LogIn, 
  UserPlus,
  X
} from 'lucide-react';

import { useAuth } from '@providers/AuthProvider';

export default function SideBar({ onClose }) {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={styles.sidebar}>
      <button className={styles.closeButton} onClick={onClose} aria-label="Fechar menu">
        <X size={24} strokeWidth={2} />
      </button>

      <div className={styles.brandHeader}>
        <div className={styles.emeraldBg}>
          <Leaf size={32} className={styles.iconEmerald} />
        </div>
        <h2 className={styles.brandTitle}>Green Roof Atlas</h2>
      </div>

      <nav className={styles.navContainer}>
        {/* Links principais */}
        <ul className={styles.links}>
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/profile" onClick={onClose} className={isActive('/profile') ? styles.active : ''}>
                  <User size={20} />
                  <span>Conta</span>
                </Link>
              </li>
              <li>
                <Link to="/green-roof/create" onClick={onClose} className={isActive('/green-roof/create') ? styles.active : ''}>
                  <PlusCircle size={20} />
                  <span>Novo Telhado</span>
                </Link>
              </li>
              <li>
                <Link to="/reports" onClick={onClose} className={isActive('/reports') ? styles.active : ''}>
                  <FileText size={20} />
                  <span>Relatórios</span>
                </Link>
              </li>
              <li>
                <Link to="/notifications" onClick={onClose} className={isActive('/notifications') ? styles.active : ''}>
                  <Bell size={20} />
                  <span>Alertas</span>
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={onClose} className={isActive('/login') ? styles.active : ''}>
                  <LogIn size={20} />
                  <span>Entrar</span>
                </Link>
              </li>
              <li>
                <Link to="/register" onClick={onClose} className={isActive('/register') ? styles.active : ''}>
                  <UserPlus size={20} />
                  <span>Cadastro</span>
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Links Secundários / Rodapé do Sidebar */}
        <ul className={styles.bottomLinks}>
          <div className={styles.divider} />
          <li>
            <Link to="/about" onClick={onClose} className={isActive('/about') ? styles.active : ''}>
              <Info size={20} />
              <span>Sobre</span>
            </Link>
          </li>
          
          {isAuthenticated && (
            <li>
              <button 
                onClick={() => { logout(); onClose(); }} 
                className={styles.logoutButton}
                aria-label="Sair da conta"
              >
                <LogOut size={20} />
                <span>Sair</span>
              </button>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
}