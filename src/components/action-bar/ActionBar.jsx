import styles from './ActionBar.module.css';

import { createPortal } from 'react-dom';
import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';

// Importando os ícones da Lucide
import { Search, Home, Menu } from 'lucide-react';

import SideBar from '@components/side-bar/SideBar';

export default function ActionBar() {
  const [sidebar, setSidebar] = useState(false);

  const toggleSideBar = () => setSidebar((prev) => !prev);

  // UX: Fechar o sidebar ao pressionar a tecla 'Escape'
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && sidebar) {
        setSidebar(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sidebar]);

  // UX: Prevenir scroll da página quando o sidebar estiver aberto
  useEffect(() => {
    if (sidebar) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebar]);

  return createPortal(
    <>
      <AnimatePresence>
        {sidebar && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(4px)' }} // Toque de design: Glassmorphism no fundo
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className={styles.overlay}
            onClick={toggleSideBar}
            aria-hidden="true"
          >
            <motion.div
              key="sidebar"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={styles.sidebarContainer}
              onClick={(e) => e.stopPropagation()} // Evita que o clique feche o menu
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navegação lateral"
            >
              <SideBar onClose={toggleSideBar} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className={styles.actionBar} aria-label="Navegação principal">
        <Link to="/search" className={styles.actionItem} aria-label="Buscar">
          <Search size={24} strokeWidth={2} />
        </Link>
        
        <Link to="/" className={styles.actionItem} aria-label="Página Inicial">
          <Home size={24} strokeWidth={2} />
        </Link>
        
        <button 
          className={styles.actionItem} 
          onClick={toggleSideBar}
          aria-label="Abrir menu"
          aria-expanded={sidebar}
        >
          <Menu size={24} strokeWidth={2} />
        </button>
      </nav>
    </>,
    document.body
  );
}