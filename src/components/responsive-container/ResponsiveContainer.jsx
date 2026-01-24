import styles from './ResponsiveContainer.module.css'

export default function ResponsiveContainer({ children, minWidth, gap }) {
    
    const style = {
        gap: gap,
        '--min-width': minWidth,
    }

    return <div style={style} className={styles.container}>{ children }</div>
}