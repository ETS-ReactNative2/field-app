import TextInput from "../text_input";

const FreeText = ({ interviewMode, color="blue", placeholder, unit, response, onAnswer=()=>{}, setCanSubmit=()=>{}, ...rest }) => {
  const [previous, setPrevious] = useState("");
  let defaultValue = response && response.value;
  
  if (interviewMode) {
    defaultValue = null;
  }

  const handleBlur = (text) => {
    if (text === previous) return;
    setPrevious(text);
    onAnswer(text);
  };

  // Enable the submit button as soon as the user starts typing.
  const handleChange = (text) => {
    setCanSubmit(text !== previous);
  };

  return (
      <TextInput
      color={color}
      placeholder={placeholder}
      units={unit && unit.plural}
      defaultValue={defaultValue}
      onBlur={handleBlur}
      onChangeText={handleChange} 
      question={true}
      />
  );
};

export default FreeText;
