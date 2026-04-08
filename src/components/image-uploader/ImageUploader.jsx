import styles from "./ImageUploader.module.css";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import CloseIcon from '@components/icons/CloseIcon';
import ImageIcon from '@components/icons/ImageIcon';

import { API_URL } from '@config/api/api.js';

export default function ImageUploader({ images, addImage, removeImage }) {
  const imageInputRef = useRef();

  const originals = images?.originals || [];
  const toAdd = images?.toAdd || [];
  const isEmpty = originals.length === 0 && toAdd.length === 0;

  const handleAddImage = e => {
    const files = Array.from(e.target.files);
    files.forEach(img => addImage(img));
    e.target.value = ""; // Possibilita o reenvio da mesma imagem 
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Galeria de Imagens</h2>
        <p>Selecione as imagens que deseja associar a este registro.</p>
      </div>

      <div 
        className={styles.uploadArea} 
        onClick={() => imageInputRef.current.click()}
        role="button"
        tabIndex={0}
      >
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          onChange={handleAddImage} 
          ref={imageInputRef} 
          className={styles.hiddenInput} 
        />
        <div className={styles.uploadContent}>
          <div className={styles.iconWrapper}>
            <ImageIcon />
          </div>
          <span className={styles.uploadText}>
            <strong>Clique para fazer upload</strong> ou arraste os arquivos
          </span>
          <span className={styles.uploadSubtext}>Suporta JPG, PNG e WEBP</span>
        </div>
      </div>

      <motion.div layout className={styles.previewGrid}>
        <AnimatePresence mode="popLayout">
          {isEmpty && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={styles.previewEmpty}
            >
              <ImageIcon />
              <span>Nenhuma imagem selecionada</span>
            </motion.div>
          )}

          {originals.map(img => (
            <Preview 
              key={`orig-${img.id || img.url}`} // Importante para o Framer Motion mapear os elementos
              source={`${API_URL}/${img.url}`} 
              onRemove={() => removeImage(img, null)}
            />
          ))}

          {toAdd.map((source, index) => (
            <Preview 
              key={`toAdd-${source.name || index}`} 
              source={source} 
              onRemove={() => removeImage(null, index)}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function Preview({ source, onRemove }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (source instanceof File) {
      const objectUrl = URL.createObjectURL(source);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setPreviewUrl(source);
  }, [source]);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
      transition={{ duration: 0.25, type: "spring", bounce: 0.3 }}
      className={styles.imageCard}
    >
      <button 
        type="button" 
        onClick={onRemove} 
        className={styles.removeButton}
        title="Remover imagem"
      >
        <CloseIcon />
      </button>
      {previewUrl && <img src={previewUrl} alt="Preview" className={styles.image} />}
    </motion.div>
  )
}