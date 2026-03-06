import styles from './ActionBar.module.css'
import { createPortal } from 'react-dom'
import { Link } from 'react-router';
import { useState } from 'react';

import SideBar from '@components/side-bar/SideBar'
import SearchIcon from '@components/icons/SearchIcon'
import HomeIcon from '@components/icons/HomeIcon'
import MenuIcon from '@components/icons/MenuIcon'
import { AnimatePresence, motion } from 'motion/react';

export default function ActionBar() {
  const [sidebar, setSidebar] = useState(false);

  function closeSideBar() {
    setSidebar(false);
  }

  return createPortal((
    <>
      <AnimatePresence>
        {sidebar &&  (
          /* 1. O OVERLAY ESCURO: Fica fixo e faz apenas fade in/out */
          <motion.div 
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)', // Cor do fundo escuro
              zIndex: 9999
            }}
            onClick={closeSideBar} // Clicar no fundo escuro fecha o menu
          >
            <motion.div 
              key="sidebar-menu"
              initial={{x: "100%"}} 
              animate={{x: 0}}
              exit={{x: "100%"}} 
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                position: 'absolute', // Absolute em relação ao overlay
                top: 0,
                right: 0, 
                height: '100vh',
                // Remova o width abaixo se a largura já estiver definida no seu SideBar.module.css
                width: '300px', 
                zIndex: 100000000 // Certifique-se de que o z-index do menu seja maior que o do overlay
              }}
              onClick={(e) => e.stopPropagation()} // Evita que clicar no menu feche ele
            >
              <SideBar onClose={closeSideBar}/>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className={styles.actionBar}>
        <Link to="/search"><SearchIcon/></Link>
        <Link to="/"><HomeIcon/></Link>
        <button onClick={() => setSidebar(prev => !prev)} className={styles.menuButton}>
          <MenuIcon/>
        </button>
      </nav>
    </>
  ), document.body);
}