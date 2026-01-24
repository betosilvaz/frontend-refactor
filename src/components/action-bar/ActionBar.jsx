import styles from './ActionBar.module.css'

import { createPortal } from 'react-dom'
import { Link } from 'react-router';
import { useState } from 'react';

import SideBar from '@components/side-bar/SideBar'
import SearchIcon from '@components/icons/SearchIcon'
import HomeIcon from '@components/icons/HomeIcon'
import MenuIcon from '@components/icons/MenuIcon'

export default function ActionBar() {
  const [sidebar, setSidebar] = useState(false);

  return createPortal((
    <>
      {sidebar && <SideBar onClose={() => setSidebar(false)}/>}
      <nav className={styles.actionBar}>
        <Link to="/search"><SearchIcon/></Link>
        <Link to="/"><HomeIcon/></Link>
        <Link onClick={() => setSidebar(prev => !prev)}><MenuIcon/></Link>
      </nav>
    </>
  ), document.body);
}