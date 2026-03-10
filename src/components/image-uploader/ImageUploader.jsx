import styles from "./ImageUploader.module.css";

import { useState, useRef, useEffect } from "react";

import CloseIcon from '@components/icons/CloseIcon';
import ImageIcon from '@components/icons/ImageIcon';

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
    <div className={styles.imagesForm}>
      <h1 className={styles.header}>Selecione algumas imagens</h1>
      <input type="file" multiple accept="image/*" onChange={handleAddImage} ref={imageInputRef} style={{ display: 'none' }} />
      <button type="button" className={styles.addImageButton} onClick={() => imageInputRef.current.click()}>Adicionar Imagem</button>
      <div className={styles.previewGrid}>
        {isEmpty && <div className={styles.previewEmpty}><ImageIcon/></div>}
        {originals.map(img => <Preview source={img} onRemove={() => removeImage(img, null)}/>)}
        {toAdd.map((url, index) => <Preview source={url} onRemove={() => removeImage(null, index)}/>)}
      </div>
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
    <div className={styles.imageGroup}>
      <button type="button" onClick={onRemove}><CloseIcon/></button>
      {previewUrl && <img src={previewUrl}/>}
    </div>
  )
}