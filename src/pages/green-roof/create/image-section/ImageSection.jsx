import ImageUploader from "@components/image-uploader/ImageUploader";

export default function ImageSection({ images, addImage, removeImage }) {
  const defaultValue = {originals: [], toAdd: []};
  return <ImageUploader images={images ?? defaultValue} addImage={addImage} removeImage={removeImage} />;
}