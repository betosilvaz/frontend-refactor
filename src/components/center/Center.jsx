import styles from './Center.module.css'

export default function Center({ children }) {
    return <div className={styles.centeredContainer}>{ children }</div>
}