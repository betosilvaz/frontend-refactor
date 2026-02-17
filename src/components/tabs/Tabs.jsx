import styles from "./Tabs.module.css";

export default function Tabs({ changeTab, options, actual }) {
  return (
    <div className={styles.tabs}>
      {options.map((e, index) => {
        return (
          <span className={actual === index + 1 ? styles.selected : ""} onClick={() => changeTab(index + 1)}>
            {e}
          </span>
        );
      })}
    </div>
  );
}