import styles from './Login.module.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowLeft, LogIn, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

import AppError from '@utils/AppError.js';
import { ERROR_CODES } from '@utils/ErrorCodes.js';
import { useAuth } from '@providers/AuthProvider';

const initialState = {
  email: "",
  password: "",
};

// Variáveis de animação para o Framer Motion
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

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      validateForm(form);
      await login(form.email, form.password);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

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
            <h2>Bem-vindo de volta!</h2>
            <p>Acesse sua conta para continuar.</p>
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
              <h2>Entrar</h2>
              <p>Insira suas credenciais abaixo</p>
            </motion.div>

            <motion.div variants={itemVariants} className={styles.formGroup}>
              <label htmlFor='email'>Email</label>
              <div className={styles.inputWrapper}>
                <Mail className={styles.inputIcon} size={18} />
                <input 
                  type="email" 
                  name="email" 
                  id="email" 
                  placeholder="johndoe@example.com" 
                  value={form.email} 
                  onChange={handleChange} 
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className={styles.formGroup}>
              <div className={styles.labelRow}>
                <label htmlFor='password'>Senha</label>
                <Link to="/forgot-password" className={styles.forgotPasswordLink}>Esqueceu a senha?</Link>
              </div>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} size={18} />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  name="password" 
                  id="password" 
                  placeholder="••••••••" 
                  value={form.password} 
                  onChange={handleChange}
                  className={styles.hasToggle}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Entrando...' : (
                  <>
                    <LogIn size={18} />
                    Entrar
                  </>
                )}
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className={styles.message}>
              <span>Não possui uma conta? <Link to="/register">Cadastre-se</Link></span>
            </motion.div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
}

function validateForm(form) {
  if (!form.email || !form.password) {
    throw new AppError({
      code: ERROR_CODES.PARSE,
      message: "Todos os campos devem estar preenchidos!",
    });
  }
}