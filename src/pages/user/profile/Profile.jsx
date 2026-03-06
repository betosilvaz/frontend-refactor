import styles from './Profile.module.css'

import { useState, useEffect } from 'react';
import { Link } from 'react-router';

import FloatingButton from '@components/floating-button/FloatingButton';
import Container from '@components/container/Container'
import UserIcon from '@components/icons/UserIcon'
import FormGroup from '@components/form-group/FormGroup'
import Input from '@components/input/Input'
import ResponsiveRow from '@components/responsive-row/ResponsiveRow'
import Center from '@components/center/Center'
import SuccessIcon from '@components/icons/SuccessIcon'

import { API_URL } from '@config/api/api.js'
import toast from 'react-hot-toast';

export default function Profile() {
  const [status, setStatus] = useState("viewing");
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    async function getData() {
      try {

        const jwt = localStorage.getItem("jwt");

        const endpoint = `${API_URL}/api/auth/me`;
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + jwt
          }
        });

        if (!response.ok) {
          const data = await response.json();
          return toast.error(data.message);
        }

        const data = await response.json();
        setData(data);

      } catch(err) {
        return toast.error(err.message);
      }
    }
    getData();
  }, []);

  async function submit(e) {
    e.preventDefault();

    try {

      const jwt = localStorage.getItem("jwt");

      const endpoint = `${API_URL}/api/users`;
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + jwt
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const data = await response.json();
        return toast.error(data.message);
      }

      setStatus("viewing")
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 2000);

    } catch(err) {
      return toast.error(data.message);
    }
  }
  
  function handleChange(e) {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (success) {
    return (
      <Center>
        <div className={styles.successScreen}>
          <SuccessIcon/>
          <span>Alteração concluida!</span>
        </div>
      </Center>
    )
  }

  return (
    <Container>
      <FloatingButton to="/">Inicio</FloatingButton>
      <div className={styles.box}>
        <h1 className={styles.header}>Detalhes da conta</h1>
        <UserIcon />
        <form onSubmit={submit} method="POST" className={styles.form}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Informações Pessoais</h2>
            <ResponsiveRow>
              <FormGroup>
                <label htmlFor="name">Nome Completo</label>
                <Input type="text" name="name" value={data?.name} onChange={handleChange} disabled={status === "viewing" ? true : false} />
              </FormGroup>
              <FormGroup>
                <label htmlFor="email">E-mail</label>
                <Input type="email" name="email" value={data?.email} onChange={handleChange} disabled={status === "viewing" ? true : false} />
              </FormGroup>
            </ResponsiveRow>
            <ResponsiveRow>
              <FormGroup>
                <label htmlFor="number">Telefone</label>
                <Input type="text" name="number" value={data?.number} onChange={handleChange} disabled={status === "viewing" ? true : false} />
              </FormGroup>
              <FormGroup>
                <label htmlFor="cpf">CPF</label>
                <Input type="text" name="cpf" value={data?.cpf} onChange={handleChange} disabled={status === "viewing" ? true : false} />
              </FormGroup>
            </ResponsiveRow>
          </div>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Informações da Conta</h2>
            <FormGroup>
              <label htmlFor="role">Função</label>
              <Input type="text" name="role" value={data?.roles[0]} disabled />
            </FormGroup>
          </div>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Ações Avançadas</h2>
            <Link to="/reset-password" className={styles.changePasswordButton}>Redefinir Senha</Link>
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