import React, { useState, useMemo } from "react";
import styles from "./AdminDashboard.module.css";
import { motion, AnimatePresence } from "framer-motion";

import ActionBar from '@components/action-bar/ActionBar';
import Container from '@components/container/Container';
import Input from '@components/input/Input';
import FormGroup from '@components/form-group/FormGroup';
import ResponsiveRow from '@components/responsive-row/ResponsiveRow';

// Dados simulados para o exemplo
const initialUsers = [
  { id: 1, name: "Ana Beatriz", email: "ana.beatriz@exemplo.com", status: "ATIVA", role: "USER" },
  { id: 2, name: "Carlos Eduardo", email: "carlos.ed@exemplo.com", status: "DESATIVADA", role: "USER" },
  { id: 3, name: "Fernanda Lima", email: "fernanda.l@exemplo.com", status: "ATIVA", role: "ADMIN" },
];

export default function AdminDashboard() {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  // Filtra usuários pela barra de pesquisa
  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // Alterna o status da conta
  const toggleStatus = (id) => {
    setUsers(users.map(user => 
      user.id === id 
        ? { ...user, status: user.status === "ATIVA" ? "DESATIVADA" : "ATIVA" } 
        : user
    ));
  };

  // Lida com as mudanças no formulário de edição
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingUser(prev => ({ ...prev, [name]: value }));
  };

  // Salva as alterações
  const saveEdit = () => {
    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    setEditingUser(null);
  };

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
          
          <h1>
            Gerenciamento de <br/>
            <span className={styles.highlight}>Usuários</span>
          </h1>
          
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
            {!editingUser ? (
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
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
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
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <tr key={user.id}>
                            <td className={styles.userName}>{user.name}</td>
                            <td className={styles.userEmail}>{user.email}</td>
                            <td>
                              <span className={`${styles.statusBadge} ${user.status === 'ATIVA' ? styles.statusActive : styles.statusInactive}`}>
                                {user.status}
                              </span>
                            </td>
                            <td className={styles.actionsCell}>
                              <button onClick={() => setEditingUser(user)} className={styles.actionBtn}>
                                Editar
                              </button>
                              <button 
                                onClick={() => toggleStatus(user.id)} 
                                className={`${styles.actionBtn} ${user.status === 'ATIVA' ? styles.btnDanger : styles.btnSuccess}`}
                              >
                                {user.status === 'ATIVA' ? 'Desativar' : 'Ativar'}
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
            ) : (
              <motion.div 
                key="edit"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className={styles.editContainer}
              >
                <div className={styles.editHeader}>
                  <div>
                    <h2>Editar Usuário</h2>
                    <p>Atualize os dados cadastrais de {editingUser.name}</p>
                  </div>
                  <button className={styles.backBtn} onClick={() => setEditingUser(null)}>
                    Voltar para lista
                  </button>
                </div>

                <div className={styles.formGrid}>
                  <ResponsiveRow>
                    <FormGroup>
                      <label>Nome Completo</label>
                      <Input type="text" name="name" value={editingUser.name} onChange={handleEditChange} />
                    </FormGroup>
                    <FormGroup>
                      <label>Email</label>
                      <Input type="email" name="email" value={editingUser.email} onChange={handleEditChange} />
                    </FormGroup>
                  </ResponsiveRow>
                  
                  <div className={styles.saveAction}>
                    <button type="button" className={styles.submitButton} onClick={saveEdit}>
                      Salvar Alterações
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Container>
    </div>
  );
}