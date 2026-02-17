import styles from "./ImageUploader.module.css";

import CloseIcon from '@components/icons/CloseIcon'

import { useState, useRef, useEffect } from "react";

export default function ImageUploader({ images, setImages, setImagesToRemove }) {
	const [previews, setPreviews] = useState([]);
	const imageInputRef = useRef();

	function handleAddImage(e) {
		const files = Array.from(e.target.files);
		setImages(prev => [...prev, ...files]);
		e.target.value = ""; // permite selecionar o mesmo arquivo de novo
	}

	function handleButtonClick() {
		imageInputRef.current.click();
	}
	
	function handleRemoveImage(indexToRemove) {
		setImages(prev => {
			let removed = prev[indexToRemove];
			
			if (typeof removed === "string") {
				setImagesToRemove(p => [...p, removed]);
			}
			
			return prev.filter((item, index) => index !== indexToRemove);
		});
	}

	useEffect(() => {
		if (!images.length) {
			setPreviews([]);
			return;
		}

		const urls = images.map(file => {
			if(typeof file === "string") {
				return file;
			} else {
				return URL.createObjectURL(file)
			}
		});
		setPreviews(urls);

		return () => {
			urls.forEach(p => {
				if (typeof p === "string") return;
				URL.revokeObjectURL(p);
			});
		};

	}, [images, setPreviews]);

	return (
		<div className={styles.imagesForm}>
			<h1 className={styles.header}>Selecione algumas imagens</h1>
			<div className={styles.formGroup}>
				<input type="file" name="images" id="imageInput" className={styles.imageInput} multiple onChange={handleAddImage} ref={imageInputRef} />
				<button type="button" className={styles.addImageButton} onClick={handleButtonClick}>Adicionar Imagem</button>
			</div>
			<div className={styles.previewGrid}>
				{previews.map((image, index) => {
					return (
						<div className={styles.imageGroup}>
							<button type="button" onClick={() => { handleRemoveImage(index) }}>
								<CloseIcon/>
							</button>
							<img src={image}/>
						</div>
					);
				})}
			</div>
		</div>
	);

}
