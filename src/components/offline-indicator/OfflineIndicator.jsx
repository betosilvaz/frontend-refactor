import { useEffect, useState } from 'react'
import { WifiOff } from 'lucide-react'

import styles from './OfflineIndicator.module.css'

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div className={styles.banner} role="status" aria-live="polite">
      <WifiOff size={16} />
      <span>Você está offline. Algumas funções podem estar indisponíveis.</span>
    </div>
  )
}
