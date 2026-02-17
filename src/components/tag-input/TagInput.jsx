import styles from './TagInput.module.css';

import Tagify from "@yaireo/tagify";
import "@yaireo/tagify/dist/tagify.css";

import { useEffect, useRef } from "react";

export default function TagInput({ value = [], onChange, label, name }) {
  const inputRef = useRef(null);
  const tagifyRef = useRef(null);

  useEffect(() => {
    tagifyRef.current = new Tagify(inputRef.current, {
      whitelist: [],
      enforceWhitelist: false,
      dropdown: {
        enabled: 1,
      },
      classNames: {
        namespace: "tagify",
      }
    });

    tagifyRef.current.on("change", e => {
      onChange?.(e);
    });

    return () => {
      tagifyRef.current.destroy();
    };
  }, [onChange]);

  useEffect(() => {
    if (!tagifyRef.current) return;

    tagifyRef.current.removeAllTags();

    if (value.length) {
      tagifyRef.current.addTags(
        value.map(v => ({ value: v }))
      );
    }
  }, [value]);

  return (
    <div className={styles.input}>
      <label htmlFor={name}>{label}</label>
      <input ref={inputRef} name={name} id={name} />
    </div>
  );
}