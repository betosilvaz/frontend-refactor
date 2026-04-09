import { forwardRef, useState } from 'react'; // Importe useState
import { Eye, EyeOff } from 'lucide-react'; // Importe os ícones
import styles from './Input.module.css';

const Input = forwardRef(({ className, hasError, type, ...props }, ref) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const inputType = (type === 'password' && isPasswordVisible) ? 'text' : (type || 'text');

  // Combina as classes, incluindo uma classe condicional se for um input de senha com ícone
  const inputClasses = [
    styles.input,
    hasError ? styles.error : '',
    type === 'password' ? styles.hasIcon : '', // Adiciona padding extra se houver ícone
    className
  ].filter(Boolean).join(' ');

  return (
    // Container relativo para posicionar o botão
    <div className={styles.inputContainer}>
      <input
        ref={ref}
        type={inputType} // Usa o tipo determinado pelo estado
        className={inputClasses}
        {...props}
      />
      
      {/* Renderiza o botão apenas se o tipo original for 'password' */}
      {type === 'password' && (
        <button
          type="button" // Evita submeter formulários acidentalmente
          className={styles.passwordToggle}
          onClick={togglePasswordVisibility}
          // Acessibilidade: label dinâmico para leitores de tela
          aria-label={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
        >
          {isPasswordVisible ? (
            // Mostra ícone de olho aberto se a senha estiver visível
            <Eye className={styles.icon} />
          ) : (
            // Mostra ícone de olho fechado se a senha estiver oculta
            <EyeOff className={styles.icon} />
          )}
        </button>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;