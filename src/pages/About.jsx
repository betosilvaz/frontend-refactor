import { MapPin, Target, Users, Award, Code } from 'lucide-react';
import FloatingButton from '@components/floating-button/FloatingButton';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

import styles from './About.module.css';

const Sobre = () => {
  return (
    <div className={styles.sobreContainer}>
      <Link to="/" className={styles.backButton}>
        <ArrowLeft size={20} />
        <span>Inicio</span>
      </Link>
      
      {/* Hero Section */}
      <motion.header 
        className={styles.heroSection}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className={styles.badge}>Sobre o Projeto</span>
        
        <h1 className={styles.heroTitle}>
          Cultivando um Recife mais verde,<br />
          <span className={styles.highlight}>um telhado por vez.</span>
        </h1>
        
        <p className={styles.heroSubtitle}>
          Nossa plataforma utiliza geolocalização e dados precisos para mapear,
          registrar e monitorar iniciativas de telhados verdes, transformando a
          paisagem urbana e a qualidade de vida na cidade.
        </p>
      </motion.header>

      {/* Main Content */}
      <motion.main 
        className={styles.mainContent}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className={styles.floatingContent}>
          {/* O Sistema & Motivação */}
          <section className={styles.infoGrid}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.iconWrapper + ' ' + styles.blueBg}>
                  <MapPin size={24} />
                </div>
                <h2>O Sistema</h2>
              </div>
              <p className={styles.cardText}>
                Desenvolvemos uma solução tecnológica integrada que permite aos cidadãos e
                gestores públicos cadastrarem e visualizarem telhados verdes espalhados pelo Recife.
                Através de um mapa interativo, é possível localizar essas iniciativas,
                entender seu impacto microclimático e incentivar a expansão da infraestrutura verde.
              </p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.iconWrapper + ' ' + styles.orangeBg}>
                  <Target size={24} />
                </div>
                <h2>Nossa Motivação</h2>
              </div>
              <p className={styles.cardText}>
                O avanço das ilhas de calor e a necessidade de espaços sustentáveis nos motivaram a agir.
                Acreditamos que a tecnologia é a chave para democratizar o acesso à informação ambiental.
                Nosso objetivo é proporcionar um ambiente virtual onde as pessoas possam visualizar a rede de telhados verdes
                presentes na cidade e contribuir com mais dados.
              </p>
            </div>
          </section>

          {/* Equipe & Apoio */}
          <section className={styles.teamSection}>
            <div className={styles.sectionHeader}>
              <h2>Quem faz acontecer</h2>
              <div className={styles.divider}></div>
            </div>

            <div className={styles.teamGrid}>
              {/* Desenvolvedor */}
              <div className={styles.teamMember}>
                <div className={styles.avatar}>
                  <Code size={28} />
                </div>
                <h3>Gilberto Silva do Nascimento</h3>
                <p className={styles.role}>Desenvolvedor & Criador</p>
                <p className={styles.description}>Engenharia de software e arquitetura do sistema web.</p>
              </div>

              {/* Orientador */}
              <div className={styles.teamMember}>
                <div className={styles.avatar}>
                  <Users size={28} />
                </div>
                <h3>Vânia Soares de Carvalho</h3>
                <p className={styles.role}>Orientação Acadêmica</p>
                <p className={styles.description}>Suporte metodológico e revisão científica do projeto.</p>
              </div>
            </div>

            {/* Apoio */}
            <div className={styles.supportSection}>
              <div className={styles.supportInfo}>
                <Award className={styles.iconAward} size={28} />
                <div>
                  <h4>Apoio e Financiamento</h4>
                  <p>Projeto desenvolvido com suporte institucional.</p>
                </div>
              </div>
              <div className={styles.cnpqBadge}>
                CNPq
              </div>
            </div>
          </section>
        </div>
      </motion.main>
    </div>
  );
};

export default Sobre;