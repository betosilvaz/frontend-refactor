import styles from './ResetPassword.module.css'

import { useState, useEffect } from 'react'

import { useSearchParams } from 'react-router'

import Center from '@components/center/Center'
import FormGroup from '@components/form-group/FormGroup'
import Input from '@components/input/Input'
import Button from '@components/button/Button'
import FloatingButton from '@components/floating-button/FloatingButton' 

import { API_URL } from '@config/api/api.js'
import toast from 'react-hot-toast'

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [success, setSuccess] = useState(false);
  const [changing, setChanging] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: ""
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
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem("jwt")
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const data = await response.json();
        setChanging(false);
        return toast.error(data?.message || "Erro inesperado ao redefinir senha");
      }

      setSuccess(true);
    } catch (err) {
      toast.error(err?.message || "Erro inesperado ao redefinir senha")
    } finally {
      setChanging(false);
    }

  } 

  if (changing) {
    return (
      <Center>
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
        <form className={styles.form}>
          <FormGroup>
            <label htmlFor='oldPassword'>Senha atual</label>
            <Input type="password" name="oldPassword" value={form.oldPassword} id="oldPassword" onChange={handleChange}/>
          </FormGroup>
          <FormGroup>
            <label htmlFor='newPassword'>Nova senha</label>
            <Input type="password" name="newPassword" value={form.newPassword} id="newPassword" onChange={handleChange}/>
          </FormGroup>
          <FormGroup>
            <label htmlFor='confirmNewPassword'>Confirme sua nova senha</label>
            <Input type="password" name="confirmNewPassword" value={form.confirmNewPassword} id="confirmNewPassword" onChange={handleChange}/>
          </FormGroup>
          <Button type="button" onClick={handleClick}>Confirmar</Button>
        </form>
      </div>
    </Center>
  )

}