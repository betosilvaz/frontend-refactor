import styles from './Notifications.module.css';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Bell, Wrench, Search, Clock, ArrowRight } from 'lucide-react';

import Container from '@components/container/Container';
import ActionBar from '@components/action-bar/ActionBar';

// Dados simulados baseados nos seus requisitos
const mockNotifications = [
  {
    id: 1,
    type: 'manutencao',
    title: 'Manutenção Preventiva',
    message: 'O sistema de irrigação apresenta pressão abaixo do normal. Verifique a bomba principal.',
    timestamp: 'Hoje, 14:30',
    roofId: 'telhado-123',
    roofName: 'Telhado Verde - Bloco A (IFPE)'
  },
  {
    id: 2,
    type: 'revisao',
    title: 'Revisão Periódica',
    message: 'A revisão trimestral da camada vegetal está agendada para a próxima semana.',
    timestamp: 'Ontem, 09:15',
    roofId: 'telhado-456',
    roofName: 'Telhado Verde - Reitoria'
  },
  {
    id: 3,
    type: 'manutencao',
    title: 'Atenção: Drenagem',
    message: 'Alerta de umidade excessiva retida. Possível entupimento no ralo principal do setor sul.',
    timestamp: '12 de Abril, 16:45',
    roofId: 'telhado-789',
    roofName: 'Telhado Verde - Biblioteca'
  }
];

// Animações para a lista (efeito cascata)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function Notifications() {
  return (
    <div className={styles.pageWrapper}>
      <ActionBar />
      <Container>
        
        {/* Cabeçalho */}
        <motion.header 
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className={styles.badge}>
            <Bell size={14} /> Alertas do Sistema
          </span>
          <h1 className={styles.pageTitle}>
            Minhas <span className={styles.highlight}>Notificações</span>
          </h1>
          <p className={styles.pageSubtitle}>
            Acompanhe os avisos de manutenção e revisão dos seus telhados verdes.
          </p>
        </motion.header>

        {/* Lista de Notificações */}
        <div className={styles.contentLayout}>
          <motion.div 
            className={styles.notificationList}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {mockNotifications.map((note) => {
              const isMaintenance = note.type === 'manutencao';
              
              return (
                <motion.div key={note.id} variants={itemVariants} className={styles.card}>
                  
                  {/* Ícone Indicador (Muda de cor conforme o tipo) */}
                  <div className={`${styles.iconContainer} ${isMaintenance ? styles.bgOrange : styles.bgBlue}`}>
                    {isMaintenance ? (
                      <Wrench size={24} className={styles.textOrange} strokeWidth={1.5} />
                    ) : (
                      <Search size={24} className={styles.textBlue} strokeWidth={1.5} />
                    )}
                  </div>

                  {/* Conteúdo da Notificação */}
                  <div className={styles.cardContent}>
                    <div className={styles.cardHeader}>
                      <span className={`${styles.typeTag} ${isMaintenance ? styles.tagOrange : styles.tagBlue}`}>
                        {isMaintenance ? 'Manutenção' : 'Revisão'}
                      </span>
                      <div className={styles.timeInfo}>
                        <Clock size={14} />
                        <span>{note.timestamp}</span>
                      </div>
                    </div>
                    
                    <h3 className={styles.noteTitle}>{note.title}</h3>
                    <p className={styles.noteMessage}>{note.message}</p>
                  </div>

                  {/* Ação / Link para o Telhado */}
                  <div className={styles.cardAction}>
                    <Link to={`/telhados/${note.roofId}`} className={styles.linkButton}>
                      <div className={styles.linkText}>
                        <span className={styles.linkLabel}>Acessar Telhado</span>
                        <span className={styles.roofName}>{note.roofName}</span>
                      </div>
                      <div className={styles.arrowIcon}>
                        <ArrowRight size={18} />
                      </div>
                    </Link>
                  </div>

                </motion.div>
              );
            })}
          </motion.div>
        </div>

      </Container>
    </div>
  );
}