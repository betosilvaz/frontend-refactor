import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import styles from './LoadingPage.module.css';

const LoadingPage = () => {
  return (
    <div className={styles.container}>

      {/* Container do ícone com animação de entrada (fade e scale) */}
      <motion.div
        className={styles.iconWrapper}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Ícone com animação de rotação contínua */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            ease: "linear"
          }}
        >
          {/* Ajuste o tamanho e a espessura do traço para um visual mais refinado */}
          <Loader2 size={36} strokeWidth={2} />
        </motion.div>
      </motion.div>

      {/* Texto com animação de fade (pulso suave) */}
      <motion.p
        className={styles.text}
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        transition={{
          repeat: Infinity,
          duration: 1,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      >
        Carregando...
      </motion.p>

    </div>
  );
};

export default LoadingPage;