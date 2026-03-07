import { Link } from 'react-router'
import styles from './FloatingButton.module.css'
import { createPortal } from 'react-dom'

export default function FloatingButton({ to, children }) {
    return createPortal(<Link to={to} className={styles.button}>{ children }</Link>, document.body)
}