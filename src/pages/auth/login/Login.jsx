import styles from './Login.module.css'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

import Center from '@components/center/Center'
import FormGroup from '@components/form-group/FormGroup'
import Input from '@components/input/Input'
import Button from '@components/button/Button'
import FloatingButton from '@components/floating-button/FloatingButton'

import AppError from '@utils/AppError.js'
import { useAuth } from '../../../providers/AuthProvider'

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({...prev, [name]: value}));
  }

  async function handleSubmit(e) {
      e.preventDefault();
      try {
        validateForm(form);
        await login(form.email, form.password);
      } catch (error) {
        setError(error.message);
        return;
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
          {error && <span style={{ color: 'red' }}>{error}</span>}
          <Button type="submit" onClick={handleSubmit}>Entrar</Button>
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