import styles from './Register.module.css'

import { useState } from 'react'
import { Link } from 'react-router'
import toast from 'react-hot-toast'
import { UserCheck } from 'lucide-react'

import Center from '@components/center/Center'
import FormGroup from '@components/form-group/FormGroup'
import Input from '@components/input/Input'
import Button from '@components/button/Button'
import FloatingButton from '@components/floating-button/FloatingButton'
import ResponsiveRow from '@components/responsive-row/ResponsiveRow'

import { ERROR_CODES } from '@utils/safeFetch.js'
import AppError from '@utils/AppError.js'
import { API_URL } from '@config/api/api.js'

const initialState = {
  name: "",
  email: "",
  cpf: "",
  password: "",
  confirmPassword: "",
}

export default function Register() {
  const [form, setForm] = useState(initialState);
  const [submitted, setIsSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({...prev, [name]: value}));
  }

  async function submit(e) {
    e.preventDefault();
    try {
      validateForm(form);
      const response = await fetch(API_URL + '/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        let data = await response.json();
        throw new AppError({
          message: data.message,
          status: response.status
        });
      }
      setIsSubmitted(true);
    } catch (error) {
      return toast.error(error.message);
    }
  }

  if (submitted) {
    return (
      <Center>
        <div className={styles.successWrapper}>
          <UserCheck size={60} className={styles.successIcon}/>
          <h2>Cadastro realizado com sucesso!</h2>
          <p>Um administrador precisa verificar sua conta antes que você possa usá-la.</p>
          <Link to="/" onClick={() => {setForm(initialState)}} className={styles.link}>Página inicial</Link>
        </div>
      </Center>
    );
  }

  return (
    <Center>
      <FloatingButton to="/">Voltar</FloatingButton>
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
          <ResponsiveRow>
            <FormGroup>
              <label htmlFor='password'>Senha</label>
              <Input type="password" name="password" id="password" placeholder="********" onChange={handleChange}/>
            </FormGroup>
            <FormGroup>
              <label htmlFor='confirmPassword'>Confirmar Senha</label>
              <Input type="password" name="confirmPassword" id="confirmPassword" placeholder="********" onChange={handleChange}/>
            </FormGroup>
          </ResponsiveRow>
          <Button type="submit" onClick={submit}>Cadastrar-se</Button>
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