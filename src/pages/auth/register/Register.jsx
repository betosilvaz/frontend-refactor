import styles from './Register.module.css'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

import Center from '@components/center/Center'
import FormGroup from '@components/form-group/FormGroup'
import Input from '@components/input/Input'
import Button from '@components/button/Button'
import FloatingButton from '@components/floating-button/FloatingButton'

import safeFetch, { ERROR_CODES } from '@utils/safeFetch.js'
import AppError from '@utils/AppError.js'
import { API_URL } from '@config/api/api.js'

export default function Register() {
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    cpf: "",
    password: "",
    confirmPassword: "",
  })
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({...prev, [name]: value}));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      validateForm(form);
      await safeFetch(API_URL + "/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
    } catch (error) {
      setError(error.message);
      return;
    }
    navigate("/login");
  }

  return (
    <Center>
      <FloatingButton to="/">
        Voltar
      </FloatingButton>
      <div className={styles.panel}>
        <div className={styles.panelImage}></div>
        <form className={styles.form}>
          <h2>Cadastro</h2>
          <FormGroup>
            <label htmlFor='name'>Nome</label>
            <Input type="text" name="name" id="name" placeholder="John Doe" onChange={handleChange}/>
          </FormGroup>
          <FormGroup>
            <label htmlFor='email'>Email</label>
            <Input type="email" name="email" id="email" placeholder="johndoe@example.com" onChange={handleChange}/>
          </FormGroup>
          <FormGroup>
            <label htmlFor="cpf">CPF</label>
            <Input type="text" name="cpf" id="cpf" placeholder="111.222.333-44" onChange={handleChange}/>
          </FormGroup>
          <div className={styles.row}>
            <FormGroup>
              <label htmlFor='password'>Senha</label>
              <Input type="password" name="password" id="password" placeholder="********" onChange={handleChange}/>
            </FormGroup>
            <FormGroup>
              <label htmlFor='confirmPassword'>Confirmar Senha</label>
              <Input type="password" name="confirmPassword" id="confirmPassword" placeholder="********" onChange={handleChange}/>
            </FormGroup>
          </div>
          {error && <span style={{color: 'red'}}>{error}</span>}
          <Button type="submit" onClick={handleSubmit}>Cadastrar-se</Button>
          <span className={styles.message}>Já possui uma conta? <Link to="/login">Entrar</Link></span>
        </form>
      </div>
    </Center>
  )
}

function validateForm(form) {
  if (!form.name || !form.email || !form.cpf || !form.password || !form.confirmPassword) {
    throw new AppError({
      code: ERROR_CODES.PARSER,
      message: "Preencha todos os campos!",
    });
  }

  if (form.email.indexOf('@') == -1) {
    throw new AppError({
      code: ERROR_CODES.PARSER,
      message: "Insira um email válido!",
    });
  }

  if (form.password != form.confirmPassword) {
    throw new AppError({
      code: ERROR_CODES.PARSER,
      message: "As senhas devem ser iguais"
    });
  }

  if(form.password.length < 8) {
    throw new AppError({
      code: ERROR_CODES.PARSER,
      message: "A senha deve ter no minimo 8 caracteres!",
    });
  }
}