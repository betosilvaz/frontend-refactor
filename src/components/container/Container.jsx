import styles from './Container.module.css'

export default function Container({ variant, children }) {
    if(variant === 'small') return <div className={styles.smallContainer}>{ children }</div>
    if(variant === 'large') return <div className={styles.largeContainer}>{ children }</div>
    return <div className={styles.container}>{ children }</div>
}