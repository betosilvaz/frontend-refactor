import styles from './ResponsiveRow.module.css'

export default function ResponsiveRow({ children }) {
    return <div className={styles.row}>{children}</div>
}