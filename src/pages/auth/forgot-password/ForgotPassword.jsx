import styles from './ForgotPassword.module.css'

import { useState } from 'react';

import Center from '@components/center/Center'
import Input from '@components/input/Input'
import Button from '@components/button/Button'
import FloatingButton from '@components/floating-button/FloatingButton'

import { API_URL } from '@config/api/api.js'

export default function ForgotPassword() {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  const [form, setForm] = useState({
    email: "",
  })

  async function handleClick() {
    setIsSending(s => true);
    try {

      const response = await fetch(API_URL + '/api/auth/forgot-password', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(form)
      })

      if (!response.ok) {
        const data = await response.json();
        setError(data?.message || "Erro ao enviar email");
        return;
      }

      setEmailSent(true);

    } catch(err) {
      setError(er?.message || "Erro inesperado");
    } finally {
      setIsSending(s => false);
    }
  }

  function handleChange(e) {
    setForm({email: e.target.value});
  }

  if (isSending) {
    return (
      <Center>
        <FloatingButton to="/">Inicio</FloatingButton>
        <div className={styles.container}>
          <p>Enviando...</p>
        </div>
      </Center>
    )
  }

  if (emailSent) {
    return (
      <Center>
        <FloatingButton to="/">Inicio</FloatingButton>
        <div className={styles.container}>
          <p>Email enviado!</p>
        </div>
      </Center>
    )
  }

  return (
    <Center>
      <FloatingButton to="/">Inicio</FloatingButton>
      <div className={styles.container}>
        <h1>Esqueci a senha</h1>
        <p>Para receber um email de recuperação, por favor digite o seu email abaixo</p>
        <form className={styles.form}>
          <Input type="text" name="email" value={form.email} placeholder="johndoe@exemplo.com" onChange={handleChange}/>
          { error && <span style={{color: "red"}}>{error}</span> }
          <Button type="button" onClick={handleClick}>Enviar</Button>
        </form>
      </div>
    </Center>
  )
}