import { useState, useEffect } from "react";
import styles from "./AdminDashboard.module.css";
import { motion, AnimatePresence } from "motion/react";
import toast from "react-hot-toast";

import ActionBar from '@components/action-bar/ActionBar';
import Container from '@components/container/Container';

import { API_URL } from "@config/api/api";
import fetchThis from "@utils/fetchThis";

export default function AdminDashboard() {
  const [pageData, setPageData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState(null)
  const [page, setPage] = useState(0);
  const users = pageData?.content ?? [];

  function handlePagination(direction) {
    if (direction === "forward") {
      if (pageData.last) return
      setPage(page + 1);
    }
    if (direction === "back") {
      if (page < 1) return
      setPage(page - 1);
    }
  }

  function handleActivate(userId) {
    fetchThis(`${API_URL}/api/users/${userId}/activate`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` }
    }).then(async (response) => {
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }
      toast.success("Operação realizada com sucesso!")
      fetchUsers();
    }).catch(err => toast.error("Erro: " + err.message));
  }

  function handleDeactivate(userId) {
    fetchThis(`${API_URL}/api/users/${userId}/deactivate`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` }
    }).then(async (response) => {
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }
      toast.success("Operação realizada com sucesso!")
      fetchUsers();
    }).catch(err => toast.error("Erro: " + err.message));
  }

  function handleSearchTermChange(e) {
    const value = e.target.value;
    setSearchTerm(value);
    setPage(0);
  }

  function handleFilter(e) {
    const value = e.target.value;

    setPage(0);
    if (value === "") {
      setVerifiedFilter(null);
    } else {
      setVerifiedFilter(value === "true");
    }
  }

  async function fetchUsers() {
    try {
      const response = await fetchThis(`${API_URL}/api/users/search?page=${page}&name=${searchTerm}&verified=${verifiedFilter ?? ""}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`
        }
      });
      if (!response.ok) throw new Error("Erro ao buscar usuários");
      const data = await response.json();
      setPageData(data)
    } catch(err) {
      toast.error(err.message);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [page, searchTerm, verifiedFilter]);

  return (
    <div className={styles.pageWrapper}>
      <ActionBar />
      <Container>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className={styles.badge}>Painel de Controle</span>
          <h1>Gerenciamento de <br/><span className={styles.highlight}>Usuários</span></h1>
          <p>
            Administre as contas cadastradas no sistema. Você pode alterar dados, 
            pesquisar membros específicos e suspender ou ativar acessos rapidamente.
          </p>
        </motion.div>

        <motion.div 
          className={styles.infos}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <AnimatePresence mode="wait">
            <motion.div 
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className={styles.listContainer}
            >
              <div className={styles.toolbar}>
                <div className={styles.searchWrapper}>
                  <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input 
                    type="text" 
                    className={styles.searchInput}
                    placeholder="Pesquisar por nome ou email..." 
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                  />
                </div>
                <div className={styles.filterField}>
                  <label>Estado: </label>
                  <select onChange={handleFilter} className={styles.select}>
                    <option value="">Todos</option>
                    <option value="true">Ativos</option>
                    <option value="false">Desativados</option>
                  </select>
                </div>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Nome do Usuário</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th className={styles.actionsColumn}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <tr key={user.id}>
                          <td className={styles.userName}>{user.name}</td>
                          <td className={styles.userEmail}>{user.email}</td>
                          <td>
                            <span className={`${styles.statusBadge} ${user.status === true ? styles.statusActive : styles.statusInactive}`}>
                              {user.verified === true ? "ATIVA" : "DESATIVADA"}
                            </span>
                          </td>
                          <td className={styles.actionsCell}>
                            <button 
                              onClick={() => {
                                if (user.verified) {
                                  handleDeactivate(user.id);
                                } else {
                                  handleActivate(user.id);
                                }
                              }} 
                              className={`${styles.actionBtn} ${user.verified === true ? styles.btnDanger : styles.btnSuccess}`}
                            >
                              {user.verified === true ? 'Desativar' : 'Ativar'}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className={styles.emptyState}>Nenhum usuário encontrado.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
        <section className={styles.pagination}>
          <button 
            type="button" 
            onClick={() => handlePagination("back")}
            disabled={pageData?.number === 0}
            className={styles.pageButton}
          >
            Anterior
          </button>
          <span className={styles.pageIndicator}>Página {page + 1}</span>
          <button 
            type="button" 
            onClick={() => handlePagination("forward")}
            disabled={pageData?.last}
            className={styles.pageButton}
          >
            Próxima
          </button>
        </section>
      </Container>
    </div>
  );
}