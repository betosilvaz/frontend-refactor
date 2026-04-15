import styles from './Reports.module.css';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Trash2, Plus, FileBarChart } from 'lucide-react';

import Container from '@components/container/Container';
import ActionBar from '@components/action-bar/ActionBar';
import toast from 'react-hot-toast';

import { API_URL } from '@config/api/api';

// Variantes de animação para a lista
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function Reports() {
  // Dados de exemplo simulando uma API
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`${API_URL}/api/reports`, {
          method: 'GET',
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
          }
        }); // Ajuste a URL se necessário
        
        if (!response.ok) {
          throw new Error('Erro ao buscar dados do servidor');
        }

        const data = await response.json();
        setReports(data);
      } catch (error) {
        toast.error("Erro na requisição:", error);
      }
    };

    fetchReports();
  }, []);

  const handleGenerateReport = async () => {
    try {
      const response = await fetch(`${API_URL}/api/reports`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        }
      })

      if (!response.ok) {
        throw new Error('Erro ao gerar relatório');
      }

      toast.success('Relatório gerado com sucesso! Atualize a página para ver o novo documento.');
    } catch (error) {
      toast.error(error.message || 'Ocorreu um erro ao gerar o relatório. Tente novamente mais tarde.');
    }
  };

  const handleDownload = (id) => {
    alert(`Baixando relatório ${id}...`);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/reports/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao eliminar relatório');
      }

      toast.success('Relatório eliminado com sucesso!');
      setReports(reports.filter((report) => report.reportId !== id));
    } catch (error) {
      toast.error(error.message || 'Ocorreu um erro ao eliminar o relatório. Tente novamente mais tarde.');
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <ActionBar />
      <Container>
        {/* Cabeçalho Principal da Página */}
        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className={styles.badge}>Central de Dados</span>
          <h1 className={styles.title}>
            Gestão de <span className={styles.highlight}>Relatórios</span>
          </h1>
          <p className={styles.subtitle}>
            Aceda, faça a gestão e baixe os seus documentos e métricas do sistema em formato PDF.
          </p>
        </motion.header>

        {/* Área Flutuante de Conteúdo */}
        <motion.div
          className={styles.floatingContent}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className={styles.toolbar}>
            <div className={styles.toolbarTitle}>
              <FileBarChart size={20} className={styles.toolbarIcon} />
              <h2>Documentos Recentes</h2>
            </div>
            <button className={styles.generateBtn} onClick={handleGenerateReport}>
              <Plus size={18} />
              <span>Novo Relatório</span>
            </button>
          </div>

          <div className={styles.listContainer}>
            {reports.length === 0 ? (
              <div className={styles.emptyState}>
                <FileText size={48} className={styles.emptyIcon} />
                <p>Nenhum relatório disponível no momento.</p>
              </div>
            ) : (
              <motion.ul
                className={styles.reportList}
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {reports.map((report) => (
                  <motion.li key={report.reportId} className={styles.reportItem} variants={itemVariants}>
                    <div className={styles.reportInfo}>
                      <div className={styles.iconWrapper}>
                        <FileText size={24} />
                      </div>
                      <div className={styles.reportDetails}>
                        <h3 className={styles.reportTitle}>{report.url}</h3>
                        <span className={styles.reportMeta}>
                          Criado em: {new Intl.DateTimeFormat('pt-BR', {
                            dateStyle: 'full', // 'full', 'long', 'medium', 'short'
                            timeStyle: 'short'
                          }).format(new Date(report.createdAt))} • {report.size}
                        </span>
                      </div>
                    </div>

                    <div className={styles.actions}>
                      {/* <button
                        className={styles.downloadBtn}
                        onClick={() => handleDownload(report.reportId)}
                        title="Baixar PDF"
                      >
                        <Download size={18} />
                        <span className={styles.btnText}>Baixar</span>
                      </button> */}
                      <a href={`${API_URL}/${report.url}`} target="_blank" rel="noopener noreferrer" className={styles.downloadBtn} title="Baixar PDF">
                        <Download size={18} />
                        <span className={styles.btnText}>Baixar</span>
                      </a>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(report.reportId)}
                        title="Excluir Relatório"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </div>
        </motion.div>
      </Container>
    </div>
  );
}