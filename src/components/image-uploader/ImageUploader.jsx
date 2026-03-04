import styles from "./ImageUploader.module.css";
import CloseIcon from '@components/icons/CloseIcon';
import { useState, useRef, useEffect } from "react";

export default function ImageUploader({ images, addImage, removeImage }) {
  const [newImageUrls, setNewImageUrls] = useState([]);
  const imageInputRef = useRef();

  function handleAddImage(e) {
    const files = Array.from(e.target.files);
    files.forEach(img => addImage(img));
    e.target.value = ""; 
  }

  // Gerencia APENAS as URLs das imagens recém-adicionadas (arquivos locais)
  useEffect(() => {
    const toAdd = images?.toAdd || [];
    const urls = toAdd.map(file => URL.createObjectURL(file));
    
    setNewImageUrls(urls);

    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [images?.toAdd]); 

  const originals = images?.original || [];

  return (
    <div className={styles.imagesForm}>
      <h1 className={styles.header}>Selecione algumas imagens</h1>
      <div className={styles.formGroup}>
        <input 
          type="file" 
          multiple 
          onChange={handleAddImage} 
          ref={imageInputRef} 
          style={{ display: 'none' }} 
        />
        <button type="button" className={styles.addImageButton} onClick={() => imageInputRef.current.click()}>
          Adicionar Imagem
        </button>
      </div>
      
      <div className={styles.previewGrid}>
        
        {originals.map((img) => (
          <div key={img.id} className={styles.imageGroup}>
            <button type="button" onClick={() => removeImage(img, null)}>
              <CloseIcon/>
            </button>
            <img src={img.url}/>
          </div>
        ))}

        {newImageUrls.map((url, index) => (
          <div key={url} className={styles.imageGroup}>
            <button type="button" onClick={() => removeImage(null, index)}>
              <CloseIcon/>
            </button>
            <img src={url}/>
          </div>
        ))}

      </div>
    </div>
  );
}