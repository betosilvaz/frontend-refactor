import ImageUploader from "@components/image-uploader/ImageUploader";

import styles from "./ImageSection.module.css";

export default function ImageSection({ images, addImage, removeImage }) {
  return (
    <form className={styles.imagesForm}>
      <ImageUploader images={images ?? []} addImage={addImage} removeImage={removeImage} />
    </form>
  );
}