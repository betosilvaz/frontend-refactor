import styles from "./Tabs.module.css";

import { createContext, useContext, useState } from "react";

const TabsContext = createContext();

function Tabs({ children, defaultValue }) {
  const [active, setActive] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ active, setActive }}>
      {children}
    </TabsContext.Provider>
  );
}

function List({ children }) {
  return <div className={styles.tabs}>{children}</div>;
}

function Content({ children, value }) {
  const { active } = useContext(TabsContext);

  if (active !== value) return null;

  return <div className={styles.forms}>{children}</div>;
}

function Trigger({ children, value }) {
  const { active, setActive } = useContext(TabsContext);

  const selected = active === value;

  return (
    <button onClick={() => setActive(value)} className={selected ? styles.selected : ""}>
      {children}
    </button>
  );
}

Tabs.List = List;
Tabs.Trigger = Trigger;
Tabs.Content = Content;

export default Tabs;