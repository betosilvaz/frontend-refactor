import ImageUploader from "@components/image-uploader/ImageUploader";

import styles from "./ImageSection.module.css";

export default function ImageSection({ images, setImages }) {
  return (
    <form className={styles.imagesForm}>
      <ImageUploader images={images} setImages={setImages} />
    </form>
  );
}