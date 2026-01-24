import styles from './Unauthorized.module.css'

import Center from '@components/center/Center'

export default function Unauthorized() {
    return (
        <Center>
            <span className={styles.message}>Você não tem permissão de acesso à essa rota.</span>
        </Center>
    )
}