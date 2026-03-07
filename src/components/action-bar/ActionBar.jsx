import styles from './ActionBar.module.css'

import { createPortal } from 'react-dom'
import { Link } from 'react-router';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import SideBar from '@components/side-bar/SideBar'
import SearchIcon from '@components/icons/SearchIcon'
import HomeIcon from '@components/icons/HomeIcon'
import MenuIcon from '@components/icons/MenuIcon'

export default function ActionBar() {
  const [sidebar, setSidebar] = useState(false);

  const toggleSideBar = () => setSidebar(prev => !prev);

  return createPortal((
    <>
      <AnimatePresence>
        {sidebar && (
          <motion.div 
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 9999
            }}
            onClick={toggleSideBar}
          >
            <motion.div 
              key="sidebar"
              initial={{x: "100%"}} 
              animate={{x: 0}}
              exit={{x: "100%"}} 
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                position: 'absolute',
                top: 0,
                right: 0, 
                height: '100vh',
                width: '300px', 
                zIndex: 100000000
              }}
              onClick={(e) => e.stopPropagation()} // Evita que clicar no menu feche ele
            >
              <SideBar onClose={toggleSideBar}/>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className={styles.actionBar}>
        <Link to="/search"><SearchIcon/></Link>
        <Link to="/"><HomeIcon/></Link>
        <button className={styles.menuButton} onClick={toggleSideBar}><MenuIcon/></button>
      </nav>
    </>
  ), document.body);
}