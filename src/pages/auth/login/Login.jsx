import styles from './Login.module.css'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

import Center from '@components/center/Center'
import FormGroup from '@components/form-group/FormGroup'
import Input from '@components/input/Input'
import Button from '@components/button/Button'
import FloatingButton from '@components/floating-button/FloatingButton'

import AppError from '@utils/AppError.js'
import { ERROR_CODES } from '@utils/safeFetch.js'
import { useAuth } from '@providers/AuthProvider'
import toast from 'react-hot-toast'

const initialState = {
  email: "",
  password: "",
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState(initialState);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({...prev, [name]: value}));
  }

  async function submit(e) {
    e.preventDefault();
    try {
      validateForm(form);
      await login(form.email, form.password);
    } catch (error) {
      return toast.error(error.message);
    }
    navigate("/");
  }

  return (
    <Center>
      <FloatingButton to="/">Voltar</FloatingButton>
      <div className={styles.panel}>
        <div className={styles.panelImage}></div>
        <form className={styles.form}>
          <h2>Entrar</h2>
          <FormGroup>
            <label htmlFor='email'>Email</label>
            <Input type="email" name="email" id="email" placeholder="johndoe@example.com" onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <label htmlFor='password'>Senha</label>
            <Input type="password" name="password" id="password" placeholder="********" onChange={handleChange} />
          </FormGroup>
          <Link to="/forgot-password" className={styles.forgotPasswordLink}>Esqueci a senha</Link>
          <Button type="submit" onClick={submit}>Entrar</Button>
          <span className={styles.message}>Não possui uma conta? <Link to="/register">Cadastrar-se</Link></span>
        </form>
      </div>
    </Center>
  )
}

function validateForm(form) {
  if (!form.email || !form.password) {
    throw new AppError({
      code: ERROR_CODES.PARSER,
      message: "Todos os campos devem estar preenchidos!",
    });
  }
}