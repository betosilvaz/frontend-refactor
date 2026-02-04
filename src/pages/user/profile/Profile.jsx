import styles from './Profile.module.css'

import { useState } from 'react';
import { Link } from 'react-router';

import FloatingButton from '@components/floating-button/FloatingButton';
import Container from '@components/container/Container'
import UserIcon from '@components/icons/UserIcon'
import FormGroup from '@components/form-group/FormGroup'
import Input from '@components/input/Input'
import ResponsiveRow from '@components/responsive-row/ResponsiveRow'

export default function Profile() {
  const [status, setStatus] = useState("viewing");

  const userData = {
    name: "John Doe",
    email: "johndoe@example.com",
    number: "(81) 98888 7777",
    cpf: "777.888.999.80",
    role: "admin",
  }

  return (
    <Container>
      <FloatingButton to="/">Inicio</FloatingButton>
      <div className={styles.box}>
        <h1 className={styles.header}>Detalhes da conta</h1>
        <UserIcon />
        <form action="" method="POST" className={styles.form}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Informações Pessoais</h2>
            <ResponsiveRow>
              <FormGroup>
                <label htmlFor="name">Nome Completo</label>
                <Input type="text" name="name" value={userData.name} disabled={status === "viewing" ? true : false} />
              </FormGroup>
              <FormGroup>
                <label htmlFor="email">E-mail</label>
                <Input type="email" name="email" value={userData.email} disabled={status === "viewing" ? true : false} />
              </FormGroup>
            </ResponsiveRow>
            <ResponsiveRow>
              <FormGroup>
                <label htmlFor="number">Telefone</label>
                <Input type="text" name="number" value={userData.number} disabled={status === "viewing" ? true : false} />
              </FormGroup>
              <FormGroup>
                <label htmlFor="cpf">CPF</label>
                <Input type="text" name="cpf" value={userData.cpf} disabled={status === "viewing" ? true : false} />
              </FormGroup>
            </ResponsiveRow>
          </div>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Informações da Conta</h2>
            <FormGroup>
              <label htmlFor="role">Função</label>
              <Input type="text" name="role" value={userData.role == "manager" ? "Gestor" : userData.role == "admin" ? "Administrador" : "Inválido"} disabled />
            </FormGroup>
          </div>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Ações Avançadas</h2>
            <Link to="/change-password" className={styles.changePasswordButton}>Redefinir Senha</Link>
          </div>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Controles do Formulário</h2>
            {status === "viewing" && (
              <button type="button" className={styles.editButton} onClick={() => setStatus("editing")}>Editar</button>
            )}
            {status === "editing" && (
              <>
                <button type="button" onClick={() => setStatus("viewing")} className={styles.cancelButton}>Cancelar Mudanças</button>
                <button type="submit" className={styles.saveButton}>Salvar Alterações</button>
              </>
            )}
          </div>
        </form>
      </div>
    </Container>
  );
}