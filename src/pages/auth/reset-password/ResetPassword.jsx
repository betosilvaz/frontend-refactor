import styles from './ResetPassword.module.css'

import { useState, useEffect } from 'react'

import { useSearchParams } from 'react-router'

import Center from '@components/center/Center'
import FormGroup from '@components/form-group/FormGroup'
import Input from '@components/input/Input'
import Button from '@components/button/Button'
import FloatingButton from '@components/floating-button/FloatingButton' 

import { API_URL } from '@config/api/api.js'

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [success, setSuccess] = useState(false);
  const [changing, setChanging] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
    token: ""
  });

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      token: searchParams.get("token") || ""
    }));
  }, []);

  useEffect(() => {
    console.log(form);
  }, [form]);


  function handleChange(e) {
    setForm(prev => ({
      ...prev, 
      [e.target.name]: e.target.value
    }))
  }

  async function handleClick(e) {
    e.preventDefault();
    setChanging(true);

    try {

      const response = await fetch(API_URL + '/api/auth/reset-password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: form.password,
          confirmPassword: form.confirmPassword,
          token: form.token
        })
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data?.message || "Erro inesperado ao redefinir senha")
        return;
      }

      setSuccess(true);
    } catch (err) {

    } finally {
      setChanging(false);
    }

  } 

  if (changing) {
    return (
      <Center>
        <FloatingButton to="/">Inicio</FloatingButton>
        <div className={styles.container2}>
          <p>Redefinindo...</p>
        </div>
      </Center>
    )
  }

  if (success) {
    return (
      <Center>
        <FloatingButton to="/">Inicio</FloatingButton>
        <div className={styles.container2}>
          <p>Redefinição concluida!</p>
        </div>
      </Center>
    )
  }

  return (
    <Center>
      <FloatingButton to="/">Inicio</FloatingButton>
      <div className={styles.container}>
        {searchParams.get("token")}
        <h1>Redefinir senha</h1>
        <p>Por favor, digite sua nova senha</p>
        <form className={styles.form}>
          <FormGroup>
            <label htmlFor='password'>Nova senha</label>
            <Input type="password" name="password" value={form.password} id="password" onChange={handleChange}/>
          </FormGroup>
          <FormGroup>
            <label htmlFor='confirmPassword'>Confirme sua nova senha</label>
            <Input type="password" name="confirmPassword" value={form.confirmPassword} id="confirmPassword" onChange={handleChange}/>
          </FormGroup>
          { error && <span style={{color: "red"}}>{error}</span>}
          <Button type="button" onClick={handleClick}>Confirmar</Button>
        </form>
      </div>
    </Center>
  )

}