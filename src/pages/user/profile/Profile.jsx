import styles from './Profile.module.css';
import { Link } from 'react-router';
import { 
  User, Shield, KeyRound, Edit2, Check, X, 
  Mail, Phone, CreditCard 
} from 'lucide-react';
import { motion } from 'framer-motion';

import Container from '@components/container/Container';
import ResponsiveRow from '@components/responsive-row/ResponsiveRow';
import ActionBar from '@components/action-bar/ActionBar';
import useProfileForm from './hooks/useProfileForm';

export default function Profile() {
  const { state, handleCancel, handleChange, submit, beginEditing } = useProfileForm();

  return (
    <div className={styles.pageWrapper}>
      <ActionBar />
      <Container>
        
        <motion.header 
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className={styles.badge}>Conta de Usuário</span>
          <h1 className={styles.pageTitle}>
            O Meu <span className={styles.highlight}>Perfil</span>
          </h1>
          <p className={styles.pageSubtitle}>
            Gerencie as suas informações pessoais, de contato e preferências de segurança.
          </p>
        </motion.header>

        <div className={styles.layoutGrid}>
          
          <motion.div 
            className={styles.profileCard}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className={styles.avatarContainer}>
              <User size={48} className={styles.userIcon} strokeWidth={1.5}/>
            </div>
            <h2 className={styles.headerTitle}>{state.data?.name || "Meu Perfil"}</h2>
            <p className={styles.headerSubtitle}>{state.data?.roles?.[0] || "Usuário"}</p>
          </motion.div>
          
          <motion.div 
            className={styles.formCard}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form onSubmit={submit} className={styles.form} data-state={state.isEditing ? "editing" : "viewing"}>
              
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <User size={20} className={styles.sectionIcon} />
                  <h3 className={styles.sectionTitle}>Informações Pessoais</h3>
                </div>
                
                <ResponsiveRow>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Nome Completo</label>
                    <div className={styles.inputWrapper}>
                      <User className={styles.inputIcon} size={18} />
                      <input 
                        type="text" 
                        name="name" 
                        id="name"
                        value={state.data?.name || ''} 
                        onChange={handleChange} 
                        disabled={!state.isEditing}
                        placeholder="Seu nome"
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email">E-mail</label>
                    <div className={styles.inputWrapper}>
                      <Mail className={styles.inputIcon} size={18} />
                      <input 
                        type="email" 
                        name="email" 
                        id="email"
                        value={state.data?.email || ''} 
                        onChange={handleChange} 
                        disabled={!state.isEditing} 
                        placeholder="exemplo@email.com"
                      />
                    </div>
                  </div>
                </ResponsiveRow>
                
                <ResponsiveRow>
                  <div className={styles.formGroup}>
                    <label htmlFor="number">Telefone</label>
                    <div className={styles.inputWrapper}>
                      <Phone className={styles.inputIcon} size={18} />
                      <input 
                        type="text" 
                        name="number" 
                        id="number"
                        value={state.data?.number || ''} 
                        onChange={handleChange} 
                        disabled={!state.isEditing} 
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="cpf">CPF</label>
                    <div className={styles.inputWrapper}>
                      <CreditCard className={styles.inputIcon} size={18} />
                      <input 
                        type="text" 
                        name="cpf" 
                        id="cpf"
                        value={state.data?.cpf || ''} 
                        onChange={handleChange} 
                        disabled={!state.isEditing} 
                        placeholder="000.000.000-00"
                      />
                    </div>
                  </div>
                </ResponsiveRow>
              </div>

              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <Shield size={20} className={styles.sectionIcon} />
                  <h3 className={styles.sectionTitle}>Segurança e Acesso</h3>
                </div>
                
                <div className={styles.securityRow}>
                  <div className={styles.securityInfo}>
                    <KeyRound size={18} className={styles.securityIcon} />
                    <span>Autenticação e Credenciais</span>
                  </div>
                  <Link to="/reset-password" className={styles.ghostButton}>
                    Redefinir Senha
                  </Link>
                </div>
              </div>

              <div className={styles.actionGroup}>
                {!state.isEditing ? (
                  <button type="button" className={styles.primaryButton} onClick={beginEditing}>
                    <Edit2 size={18} />
                    <span>Editar Perfil</span>
                  </button>
                ) : (
                  <>
                    <button type="button" onClick={handleCancel} className={styles.secondaryButton}>
                      <X size={18} />
                      <span>Cancelar</span>
                    </button>
                    <button type="submit" className={styles.successButton}>
                      <Check size={18} />
                      <span>Salvar Alterações</span>
                    </button>
                  </>
                )}
              </div>
            </form>
          </motion.div>
        </div>
        
      </Container>
    </div>
  );
}