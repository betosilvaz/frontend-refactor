import styles from './Reports.module.css';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Trash2, Plus, FileBarChart } from 'lucide-react';

import Container from '@components/container/Container';
import ActionBar from '@components/action-bar/ActionBar';
import toast from 'react-hot-toast';

import fetchThis from "@utils/fetchThis.js";
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
  const [reports, setReports] = useState({
    content: [],
    empty: true,
    size: 10
  });
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetchThis(`${API_URL}/api/reports?page=${page}&size=${reports.size}`, {
          method: 'GET',
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
          }
        });
        
        if (!response.ok) {
          throw new Error('Erro ao buscar dados do servidor');
        }

        const data = await response.json();

        console.log(data);

        setReports(data);
      } catch (error) {
        console.log(error)
        toast.error("Erro na requisição:", error.message);
      }
    };

    fetchReports();
  }, [page]);

  const handleGenerateReport = async () => {
    try {
      const response = await fetchThis(`${API_URL}/api/reports`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        }
      })

      if (!response.ok) {
        throw new Error('Erro ao gerar relatório');
      }

      const response2 = await fetchThis(`${API_URL}/api/reports?page=${page}&size=${reports.size}`, {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
        }
      });
      
      if (!response2.ok) {
        throw new Error('Erro ao buscar dados do servidor');
      }

      const data = await response2.json();
      setReports(data);
      setPage(0)

      toast.success('Relatório gerado com sucesso!');
    } catch (error) {
      toast.error(error.message || 'Ocorreu um erro ao gerar o relatório. Tente novamente mais tarde.');
    }
  };

  const onDownloadReport = async (id) => {
    const endpoint = `${API_URL}/api/reports/${id}/download`;
    try {
      const response = await fetchThis(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        }
      })

      if (!response.ok) throw new Error('Erro ao baixar relatório');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      toast.error(error.message || 'Ocorreu um erro ao baixar o relatório.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetchThis(`${API_URL}/api/reports/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao eliminar relatório');
      }

      toast.success('Relatório eliminado com sucesso!');
      setReports(prev => ({
        ...prev,
        content: prev.content.filter((report) => report.reportId !== id)
      }))
    } catch (error) {
      toast.error(error.message || 'Ocorreu um erro ao eliminar o relatório. Tente novamente mais tarde.');
    }
  };

  const handlePagination = (direction) => {
    if (direction === "forward" && !reports.last) {
      setPage(page + 1);
    } else if (direction === "back" && page > 0) {
      setPage(page - 1);
    }
  }

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
            Gere, faça a gestão e baixe os seus documentos e métricas do sistema em formato PDF.
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
            {reports.empty ? (
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
                <AnimatePresence>
                  {!reports?.empty && reports?.content?.map((report) => (
                    <motion.li 
                      key={report.reportId} 
                      className={styles.reportItem} 
                      variants={itemVariants}
                      initial="hidden" // Força o item a iniciar oculto
                      animate="show"   // Força o item a animar para visível ao montar
                      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }} // Animação ao deletar
                      layout // Reorganiza a lista suavemente quando um item é removido
                    >
                      <div className={styles.reportInfo}>
                        <div className={styles.iconWrapper}>
                          <FileText size={24} />
                        </div>
                        <div className={styles.reportDetails}>
                          <h3 className={styles.reportTitle}>{report.url?.split('/').pop() ?? 'relatório'}</h3>
                          <span className={styles.reportMeta}>
                            Criado em: {new Intl.DateTimeFormat('pt-BR', {
                              dateStyle: 'full',
                              timeStyle: 'short'
                            }).format(new Date(report.createdAt))} • {report.size}
                          </span>
                        </div>
                      </div>

                      <div className={styles.actions}>
                        <button onClick={() => onDownloadReport(report.reportId)} className={styles.downloadBtn} title="Baixar PDF">
                          <Download size={18} />
                          <span className={styles.btnText}>Baixar</span>
                        </button>
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
                </AnimatePresence>
              </motion.ul>
            )}
          </div>
        </motion.div>
        {!reports.empty && (
          <section className={styles.pagination}>
            <button 
              type="button" 
              onClick={() => handlePagination("back")}
              disabled={reports.number === 0}
              className={styles.pageButton}
            >
              Anterior
            </button>
            <span className={styles.pageIndicator}>Página {page + 1}</span>
            <button 
              type="button" 
              onClick={() => handlePagination("forward")}
              disabled={reports.last}
              className={styles.pageButton}
            >
              Próxima
            </button>
          </section>
        )}
      </Container>
    </div>
  );
}