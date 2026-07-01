import { useEffect } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import toast from 'react-hot-toast'

export default function ReloadPrompt() {
  const {
    needRefresh: [needRefresh],
    offlineReady: [offlineReady],
    updateSW,
  } = useRegisterSW({
    onRegisterError(error) {
      if (import.meta.env.DEV) console.error('SW registration error:', error)
    },
  })

  useEffect(() => {
    if (!needRefresh) return
    const id = toast('Nova versão disponível!', {
      duration: Infinity,
      action: {
        label: 'Recarregar',
        onClick: () => updateSW(true),
      },
    })
    return () => toast.dismiss(id)
  }, [needRefresh, updateSW])

  useEffect(() => {
    if (!offlineReady) return
    const id = toast('Pronto para uso offline.', { duration: 4000 })
    return () => toast.dismiss(id)
  }, [offlineReady])

  return null
}
