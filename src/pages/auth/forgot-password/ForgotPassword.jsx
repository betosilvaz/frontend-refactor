import styles from './ForgotPassword.module.css';
import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Mail, ArrowLeft, Send, CheckCircle, KeyRound, Loader2 } from 'lucide-react';

import fetchThis from "@utils/fetchThis.js";
import { API_URL } from '@config/api/api.js';

// Variáveis de animação
const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, type: "spring" } }
};

export default function ForgotPassword() {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  const [form, setForm] = useState({
    email: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email) {
      setError("Por favor, preencha o campo de email.");
      return;
    }

    setIsSending(true);
    setError(null);
    
    try {
      const response = await fetchThis(API_URL + '/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.message || "Erro ao enviar email");
      }

      setEmailSent(true);
    } catch (err) {
      setError(err?.message || "Erro inesperado. Tente novamente mais tarde.");
    } finally {
      setIsSending(false);
    }
  }

  function handleChange(e) {
    setForm({ email: e.target.value });
    if (error) setError(null); // Limpa o erro quando o usuário começa a digitar
  }

  // TELA DE SUCESSO
  if (emailSent) {
    return (
      <div className={styles.pageBackground}>
        <motion.div 
          className={styles.card}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className={styles.iconContainer}
          >
            <CheckCircle size={48} className={styles.successIcon} />
          </motion.div>
          <h2>Email enviado!</h2>
          <p className={styles.subtitle}>
            Se houver uma conta associada a <strong>{form.email}</strong>, você receberá um link para redefinir sua senha.
          </p>
          <Link to="/" className={styles.successLink}>
            Voltar para o início
          </Link>
        </motion.div>
      </div>
    );
  }

  // TELA PRINCIPAL (FORMULÁRIO)
  return (
    <div className={styles.pageBackground}>
      <Link to="/login" className={styles.backButton}>
        <ArrowLeft size={20} />
        <span>Voltar</span>
      </Link>

      <motion.div 
        className={styles.card}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <div className={styles.headerIcon}>
          <KeyRound size={40} className={styles.primaryIcon} />
        </div>
        
        <div className={styles.headerText}>
          <h2>Esqueci a senha</h2>
          <p>Para receber um link de recuperação, por favor digite o seu email abaixo.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <div className={styles.inputWrapper}>
              <Mail className={styles.inputIcon} size={18} />
              <input 
                type="email" 
                name="email" 
                value={form.email} 
                placeholder="johndoe@exemplo.com" 
                onChange={handleChange}
                disabled={isSending}
                className={error ? styles.inputError : ''}
              />
            </div>
            {error && (
              <motion.span 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className={styles.errorMessage}
              >
                {error}
              </motion.span>
            )}
          </div>

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isSending}
          >
            {isSending ? (
              <>
                <Loader2 size={18} className={styles.spinner} />
                Enviando...
              </>
            ) : (
              <>
                <Send size={18} />
                Enviar link
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}