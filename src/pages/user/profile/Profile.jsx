import styles from './Profile.module.css';

import { Link } from 'react-router';
import { User } from 'lucide-react';

import FloatingButton from '@components/floating-button/FloatingButton';
import Container from '@components/container/Container';
import FormGroup from '@components/form-group/FormGroup';
import Input from '@components/input/Input';
import ResponsiveRow from '@components/responsive-row/ResponsiveRow';
import useProfileForm from './hooks/useProfileForm';

export default function Profile() {
  const { state, handleCancel, handleChange, submit, beginEditing } = useProfileForm();

  return (
    <Container>
      <FloatingButton to="/">Início</FloatingButton>
      
      <div className={styles.box}>
        <div className={styles.profileHeader}>
          <div className={styles.avatarContainer}>
            <User size={30} className={styles.userIcon}/>
          </div>
          <h1 className={styles.headerTitle}>{state.data?.name || "Meu Perfil"}</h1>
          <p className={styles.headerSubtitle}>{state.data?.roles?.[0] || "Usuário"}</p>
        </div>
        
        {/* data-state é a chave para a mágica do CSS */}
        <form onSubmit={submit} className={styles.form} data-state={state.isEditing ? "editing" : "viewing"}>
          
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Informações Pessoais</h2>
            <ResponsiveRow>
              <FormGroup>
                <label htmlFor="name">Nome Completo</label>
                <Input type="text" name="name" value={state.data?.name || ''} onChange={handleChange} disabled={!state.isEditing}/>
              </FormGroup>
              <FormGroup>
                <label htmlFor="email">E-mail</label>
                <Input type="email" name="email" value={state.data?.email || ''} onChange={handleChange} disabled={!state.isEditing} />
              </FormGroup>
            </ResponsiveRow>
            <ResponsiveRow>
              <FormGroup>
                <label htmlFor="number">Telefone</label>
                <Input type="text" name="number" value={state.data?.number || ''} onChange={handleChange} disabled={!state.isEditing} />
              </FormGroup>
              <FormGroup>
                <label htmlFor="cpf">CPF</label>
                <Input type="text" name="cpf" value={state.data?.cpf || ''} onChange={handleChange} disabled={!state.isEditing} />
              </FormGroup>
            </ResponsiveRow>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Segurança e Acesso</h2>
            <div className={styles.securityRow}>
              <Link to="/reset-password" className={styles.ghostButton}>Redefinir Senha</Link>
            </div>
          </div>

          <div className={styles.actionGroup}>
            {!state.isEditing ? (
              <button type="button" className={styles.primaryButton} onClick={beginEditing}>
                Editar Perfil
              </button>
            ) : (
              <>
                <button type="button" onClick={handleCancel} className={styles.secondaryButton}>
                  Cancelar
                </button>
                <button type="submit" className={styles.primaryButton}>
                  Salvar Alterações
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </Container>
  );
}