import styles from './Register.module.css';
import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { User, Mail, FileText, Lock, ArrowLeft, UserPlus, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

import { ERROR_CODES } from '@utils/safeFetch.js';
import AppError from '@utils/AppError.js';
import { API_URL } from '@config/api/api.js';

const initialState = {
  name: "",
  email: "",
  cpf: "",
  password: "",
  confirmPassword: "",
};

// Variáveis de animação
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Register() {
  const [form, setForm] = useState(initialState);
  const [submitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setIsSubmitting(true);
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
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  // TELA DE SUCESSO
  if (submitted) {
    return (
      <div className={styles.pageBackground}>
        <motion.div 
          className={styles.successWrapper}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, type: "spring" }}
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className={styles.successIconContainer}
          >
            <UserCheck size={48} className={styles.successIcon} />
          </motion.div>
          <h2>Cadastro realizado!</h2>
          <p>Um administrador precisa verificar sua conta antes que você possa usá-la. Aguarde a aprovação.</p>
          <Link to="/" onClick={() => setForm(initialState)} className={styles.successLink}>
            Voltar para a página inicial
          </Link>
        </motion.div>
      </div>
    );
  }

  // TELA DE CADASTRO
  return (
    <div className={styles.pageBackground}>
      <Link to="/" className={styles.backButton}>
        <ArrowLeft size={20} />
        <span>Voltar</span>
      </Link>

      <motion.div 
        className={styles.panel}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className={styles.panelImage}>
          <div className={styles.imageOverlay}>
            <h2>Junte-se a nós!</h2>
            <p>Crie sua conta para acessar recursos exclusivos e gerenciar suas informações.</p>
          </div>
        </div>

        <div className={styles.formContainer}>
          <motion.form 
            className={styles.form} 
            onSubmit={submit}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className={styles.header}>
              <h2>Cadastro</h2>
              <p>Preencha os dados abaixo para se registrar</p>
            </motion.div>

            <motion.div variants={itemVariants} className={styles.formGroup}>
              <label htmlFor='name'>Nome completo</label>
              <div className={styles.inputWrapper}>
                <User className={styles.inputIcon} size={18} />
                <input type="text" name="name" id="name" placeholder="John Doe" value={form.name} onChange={handleChange} />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className={styles.formGroup}>
              <label htmlFor='email'>Email</label>
              <div className={styles.inputWrapper}>
                <Mail className={styles.inputIcon} size={18} />
                <input type="email" name="email" id="email" placeholder="johndoe@example.com" value={form.email} onChange={handleChange} />
              </div>
            </motion.div >

            <motion.div variants={itemVariants} className={styles.row}>
              <div className={styles.formGroup}>
                <label htmlFor='password'>Senha</label>
                <div className={styles.inputWrapper}>
                  <Lock className={styles.inputIcon} size={18} />
                  <input type="password" name="password" id="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor='confirmPassword'>Confirmar Senha</label>
                <div className={styles.inputWrapper}>
                  <Lock className={styles.inputIcon} size={18} />
                  <input type="password" name="confirmPassword" id="confirmPassword" placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} />
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Cadastrando...' : (
                  <>
                    <UserPlus size={18} />
                    Cadastrar-se
                  </>
                )}
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className={styles.message}>
              <span>Já possui uma conta? <Link to="/login">Entrar</Link></span>
            </motion.div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
}

function validateForm(form) {
  if (!form.name || !form.email || !form.password || !form.confirmPassword) {
    throw new AppError({
      code: ERROR_CODES.PARSER,
      message: "Preencha todos os campos!",
    });
  }

  if (form.email.indexOf('@') === -1) {
    throw new AppError({
      code: ERROR_CODES.PARSER,
      message: "Insira um email válido!",
    });
  }

  if (form.password !== form.confirmPassword) {
    throw new AppError({
      code: ERROR_CODES.PARSER,
      message: "As senhas devem ser iguais",
    });
  }

  if (form.password.length < 8) {
    throw new AppError({
      code: ERROR_CODES.PARSER,
      message: "A senha deve ter no mínimo 8 caracteres!",
    });
  }
}