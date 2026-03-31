import styles from './Reports.module.css';

import { useState } from 'react';

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
    // Lógica para gerar novo relatório
    alert('Iniciando geração de um novo relatório...');
  };

  const handleDownload = (id) => {
    // Lógica para baixar o PDF
    alert(`Baixando relatório ${id}...`);
  };

  const handleDelete = (id) => {
    // Lógica para deletar
    if (window.confirm('Tem certeza que deseja deletar este relatório?')) {
      setReports(reports.filter(report => report.id !== id));
    }
  };

  return (
    <Container>
      <ActionBar />
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Relatórios</h1>
            <p className={styles.subtitle}>Gerencie e baixe seus documentos em PDF</p>
          </div>
          <button className={styles.generateBtn} onClick={handleGenerateReport}>
            + Novo Relatório
          </button>
        </header>

        <div className={styles.listContainer}>
          {reports.length === 0 ? (
            <div className={styles.emptyState}>Nenhum relatório disponível.</div>
          ) : (
            <ul className={styles.reportList}>
              {reports.map((report) => (
                <li key={report.id} className={styles.reportItem}>

                  <div className={styles.reportInfo}>
                    <div className={styles.reportIcon}>📄</div>
                    <div>
                      <h2 className={styles.reportTitle}>{report.title}.pdf</h2>
                      <span className={styles.reportMeta}>
                        Criado em: {new Date(report.date).toLocaleDateString('pt-BR')} • {report.size}
                      </span>
                    </div>
                  </div>

                  <div className={styles.actions}>
                    <button
                      className={styles.downloadBtn}
                      onClick={() => handleDownload(report.id)}
                      title="Baixar PDF"
                    >
                      Baixar
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(report.id)}
                      title="Deletar Relatório"
                    >
                      Excluir
                    </button>
                  </div>

                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Container>
  );
}