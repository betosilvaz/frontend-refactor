import ImageUploader from "@components/image-uploader/ImageUploader";
import { useUpdateGreenRoofContext } from "../../providers/ContextProvider";

export default function ImageSection() {
  const { state, dispatch } = useUpdateGreenRoofContext();
  const images = state?.images;

  function addImage(image) {
    dispatch({ type: "add-image", image });
  }

  function removeImage(image, index) {
    dispatch({ type: "remove-image", image, index });
  }

  const defaultValue = {originals: [], toAdd: []};
  return <ImageUploader images={images ?? defaultValue} addImage={addImage} removeImage={removeImage} />;
}