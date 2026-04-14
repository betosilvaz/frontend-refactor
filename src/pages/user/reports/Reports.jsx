import styles from './Reports.module.css';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Trash2, Plus, FileBarChart } from 'lucide-react';

import Container from '@components/container/Container';
import ActionBar from '@components/action-bar/ActionBar';

export default function Reports() {
  // Dados de exemplo simulando uma API
  const [reports, setReports] = useState([
    { id: 1, title: 'Relatório Financeiro - Q3', date: '2025-10-15', size: '2.4 MB' },
    { id: 2, title: 'Auditoria de Sistema_v2', date: '2025-10-10', size: '1.1 MB' },
    { id: 3, title: 'Métricas de Usuários - Setembro', date: '2025-09-30', size: '850 KB' },
  ]);

  const handleGenerateReport = () => {
    alert('Iniciando geração de um novo relatório...');
  };

  const handleDownload = (id) => {
    alert(`Baixando relatório ${id}...`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza de que deseja eliminar este relatório?')) {
      setReports(reports.filter((report) => report.id !== id));
    }
  };

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
                  <motion.li key={report.id} className={styles.reportItem} variants={itemVariants}>
                    <div className={styles.reportInfo}>
                      <div className={styles.iconWrapper}>
                        <FileText size={24} />
                      </div>
                      <div className={styles.reportDetails}>
                        <h3 className={styles.reportTitle}>{report.title}.pdf</h3>
                        <span className={styles.reportMeta}>
                          Criado a: {new Date(report.date).toLocaleDateString('pt-PT')} • {report.size}
                        </span>
                      </div>
                    </div>

                    <div className={styles.actions}>
                      <button
                        className={styles.downloadBtn}
                        onClick={() => handleDownload(report.id)}
                        title="Baixar PDF"
                      >
                        <Download size={18} />
                        <span className={styles.btnText}>Baixar</span>
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(report.id)}
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