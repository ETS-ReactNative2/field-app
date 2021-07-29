import ImageInput from "../image_input";

const PhotoUpload = ({ interviewMode, color="blue", response, onAnswer=()=>{} }) => {
  const defaultImages = (response && !interviewMode) ? JSON.parse(response.value) : [];
 
  const handleChange = (images) => {
    onAnswer(images);
  };

  return (
    <ImageInput color={color} defaultImages={defaultImages} onChange={handleChange} />
  );
};

export default PhotoUpload;
