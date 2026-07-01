import { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

import styles from './ErrorBoundary.module.css';

function isChunkLoadError(error) {
  if (!error) return false;
  const name = error.name || '';
  const message = error.message || '';
  return (
    name === 'ChunkLoadError' ||
    message.includes('Failed to fetch dynamically imported module') ||
    message.includes('Loading chunk') ||
    message.includes('Importing a module script failed')
  );
}

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, chunkError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error, chunkError: isChunkLoadError(error) };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary capturou:', error, info);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const { chunkError, error } = this.state;

    return (
      <div className={styles.container} role="alert">
        <div className={styles.card}>
          <div className={styles.iconWrapper}>
            <AlertTriangle size={36} strokeWidth={2} />
          </div>

          <h1 className={styles.title}>Algo deu errado.</h1>

          <p className={styles.message}>
            {chunkError
              ? 'O sistema foi atualizado. Recarregue a página para continuar.'
              : !navigator.onLine
                ? 'Você está offline. Conecte-se à internet e tente novamente.'
                : 'Ocorreu um erro inesperado. Tente recarregar ou voltar ao início.'}
          </p>

          {import.meta.env.DEV && error?.message && (
            <pre className={styles.detail}>{error.message}</pre>
          )}

          <div className={styles.actions}>
            <button type="button" className={styles.primaryButton} onClick={this.handleReload}>
              <RefreshCw size={18} />
              <span>Recarregar</span>
            </button>

            <a to="/" className={styles.secondaryButton}>
              <Home size={18} />
              <span>Ir para o início</span>
            </a>
          </div>
        </div>
      </div>
    );
  }
}
