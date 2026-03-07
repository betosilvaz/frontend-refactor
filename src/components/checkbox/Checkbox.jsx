import styles from './Checkbox.module.css';

const Checkbox = ({ label, name, checked, onChange, ...props }) => {
  return (
    <label className={styles.checkboxContainer}>
      <div className={styles.inputWrapper}>
        <input type="checkbox" name={name} checked={checked} onChange={onChange} className={styles.hiddenCheckbox} {...props}/>
        <div className={`${styles.styledCheckbox} ${checked ? styles.checked : ''}`}>
          {checked && (
            <svg viewBox="0 0 24 24" className={styles.icon}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
      </div>
      {label && <span className={styles.labeltext}>{label}</span>}
    </label>
  );
};

export default Checkbox;