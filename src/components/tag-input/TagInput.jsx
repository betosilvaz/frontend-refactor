import Tagify from "@yaireo/tagify";
import "@yaireo/tagify/dist/tagify.css";
import { useEffect, useRef } from "react";

export default function TagInput({ value = [], onChange, onTagDelete, name }) {
  const inputRef = useRef(null);
  const tagifyRef = useRef(null);

  // Refs para sempre manter os callbacks atualizados sem re-registrar eventos
  const onChangeRef = useRef(onChange);
  const onTagDeleteRef = useRef(onTagDelete);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onTagDeleteRef.current = onTagDelete;
  }, [onTagDelete]);

  // Inicialização do Tagify — roda apenas uma vez
  useEffect(() => {
    tagifyRef.current = new Tagify(inputRef.current, {
      whitelist: [],
      enforceWhitelist: false,
      dropdown: {
        enabled: 1,
      },
      classNames: {
        namespace: "tagify",
      },
    });

    const handleRemove = (e) => {
      const tagData = e.detail.data;

      // Chama onTagDelete se a tag removida tiver id (veio do backend)
      if (tagData?.id) {
        onTagDeleteRef.current?.(tagData.id);
      }

      // Atualiza o estado com as tags restantes após a remoção
      const remaining = tagifyRef.current.value;
      onChangeRef.current?.(remaining);
    };

    const handleAdd = (e) => {
      const tags = tagifyRef.current.value;
      onChangeRef.current?.(tags);
    };

    tagifyRef.current.on("remove", handleRemove);
    tagifyRef.current.on("add", handleAdd);

    return () => {
      tagifyRef.current?.destroy();
    };
  }, []);

  // Sincroniza as tags quando `value` mudar externamente
  useEffect(() => {
    const tagify = tagifyRef.current;
    if (!tagify) return;

    const normalizeTags = (arr) =>
      arr.map((t) => ({
        id: t.id != null ? String(t.id) : undefined,
        value: typeof t === "string" ? t : t.value,
      }));

    const current = normalizeTags(tagify.value);
    const next = normalizeTags(value);

    if (JSON.stringify(current) !== JSON.stringify(next)) {
      tagify.loadOriginalValues(value);
    }
  }, [value]);

  return <input ref={inputRef} name={name} id={name} />;
}