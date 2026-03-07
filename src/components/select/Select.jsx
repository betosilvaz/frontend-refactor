import styles from './Select.module.css'

export default function Select({ name, value, options, onSelect }) {
  return (
    <select name={name} className={styles.select} value={value ?? ""} onChange={onSelect}>
      <option value="" disabled>Selecione</option>
      {options.map((item) =>
        <option value={item.value}>{item.name}</option>
      )}
    </select>
  )
}