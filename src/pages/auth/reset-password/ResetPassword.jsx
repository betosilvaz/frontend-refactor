import styles from './ResetPassword.module.css';
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router';
import { motion } from 'framer-motion';
import { Lock, KeyRound, ShieldCheck, ArrowLeft, CheckCircle2, Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

import { API_URL } from '@config/api/api.js';

// Variáveis de animação para o Framer Motion
const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut", staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [success, setSuccess] = useState(false);
  const [changing, setChanging] = useState(false);
  
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    token: ""
  });

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      token: searchParams.get("token") || ""
    }));
  }, [searchParams]);

  function handleChange(e) {
    setForm(prev => ({
      ...prev, 
      [e.target.name]: e.target.value
    }));
  }

  async function handleClick(e) {
    e.preventDefault();
    setChanging(true);

    try {
      // Validação básica no front-end
      if (form.newPassword !== form.confirmNewPassword) {
        setChanging(false);
        return toast.error("As novas senhas não coincidem!");
      }

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
        return toast.error(data?.message || "Erro inesperado ao redefinir a senha");
      }

      setSuccess(true);
    } catch (err) {
      toast.error(err?.message || "Erro inesperado ao redefinir a senha");
    } finally {
      setChanging(false);
    }
  } 

  return (
    <div className={styles.pageBackground}>
      {/* Botão de Voltar Flutuante */}
      <Link to="/profile" className={styles.backButton}>
        <ArrowLeft size={20} />
        <span>Voltar</span>
      </Link>

      <motion.div 
        className={styles.panel}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {changing ? (
          /* Estado de Carregamento */
          <motion.div className={styles.statusContainer} variants={itemVariants}>
            <Loader2 size={48} className={styles.spinnerIcon} />
            <h2>A redefinir a senha...</h2>
            <p>Por favor, aguarde um momento.</p>
          </motion.div>
        ) : success ? (
          /* Estado de Sucesso */
          <motion.div className={styles.statusContainer} variants={itemVariants}>
            <div className={styles.successIconWrapper}>
              <CheckCircle2 size={56} className={styles.successIcon} />
            </div>
            <h2>Senha redefinida!</h2>
            <p>A sua senha foi alterada com sucesso. Já pode utilizar a nova senha para acessar a sua conta.</p>
            <Link to="/login" className={styles.submitButton}>
              Ir para o Login
            </Link>
          </motion.div>
        ) : (
          /* Formulário Padrão */
          <div className={styles.formContainer}>
            <motion.div variants={itemVariants} className={styles.header}>
              <h2>Redefinir Senha</h2>
              <p>Insira a sua senha atual e escolha uma nova para proteger a sua conta.</p>
            </motion.div>

            <motion.form className={styles.form} onSubmit={handleClick} variants={containerVariants}>
              
              <motion.div variants={itemVariants} className={styles.formGroup}>
                <label htmlFor='oldPassword'>Senha Atual</label>
                <div className={styles.inputWrapper}>
                  <Lock className={styles.inputIcon} size={18} />
                  <input 
                    type="password" 
                    name="oldPassword" 
                    id="oldPassword"
                    autoComplete={false}
                    value={form.oldPassword} 
                    onChange={handleChange}
                    placeholder="Introduza a senha atual"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className={styles.formGroup}>
                <label htmlFor='newPassword'>Nova Senha</label>
                <div className={styles.inputWrapper}>
                  <KeyRound className={styles.inputIcon} size={18} />
                  <input 
                    type="password" 
                    name="newPassword" 
                    id="newPassword"
                    value={form.newPassword} 
                    onChange={handleChange}
                    placeholder="Crie uma nova senha"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className={styles.formGroup}>
                <label htmlFor='confirmNewPassword'>Confirme a Nova Senha</label>
                <div className={styles.inputWrapper}>
                  <ShieldCheck className={styles.inputIcon} size={18} />
                  <input 
                    type="password" 
                    name="confirmNewPassword" 
                    id="confirmNewPassword"
                    value={form.confirmNewPassword} 
                    onChange={handleChange}
                    placeholder="Repita a nova senha"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <button type="submit" className={styles.submitButton} disabled={changing}>
                  <Save size={18} />
                  Confirmar Alteração
                </button>
              </motion.div>

            </motion.form>
          </div>
        )}
      </motion.div>
    </div>
  );
}