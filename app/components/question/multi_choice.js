import RadioGroup, { Radio } from "../radio_group";
import CheckList, { Checkbox } from "../check_list";
import { View } from "react-native";
//field-app/config/host.json


const MultiChoice = ({ interviewMode, color="blue", response, multiChoiceOptions=[], multipleAnswers, onAnswer=()=>{} }) => {

  const optionsTextAndPhoto = multiChoiceOptions.map(o => ({photo: o.photo, text: o.text}));
  let defaultIds = response && [JSON.parse(response.value)].flat() || [];

  if (interviewMode) {
    defaultIds = [];    
  }

  const defaultIndexes = filterIndex(multiChoiceOptions, o => contains(o.id, defaultIds));

  const onChange = (indexes, previousMultiChoiceAnswerIndex) => {
      let previousMultiChoiceAnswerId = null;

      if (indexes[0] == -1) {
        onAnswer("");
        return;
      }
  
      const ids = indexes.map(index => multiChoiceOptions[index].id);
      ids.sort((a, b) => a - b);
  
      const value = ids.length <= 1 ? (ids[0] || "") : JSON.stringify(ids);
      if(previousMultiChoiceAnswerIndex) {
        previousMultiChoiceAnswerId = JSON.stringify(multiChoiceOptions[previousMultiChoiceAnswerIndex].id)

        if(value && Array.isArray(JSON.parse(value))) {
          let ansArray = JSON.parse(value)
          ansArray.includes(previousMultiChoiceAnswerId.toString());
          previousMultiChoiceAnswerId = null
        } else if (value.toString() == previousMultiChoiceAnswerId.toString()){
          previousMultiChoiceAnswerId = null
        }
      }
      onAnswer(value, previousMultiChoiceAnswerId);    
  };

  const props = { color, defaultIndexes, optionsTextAndPhoto, onChange };
  return multipleAnswers ? <MultipleAnswers {...props} /> : <SingleAnswer {...props} />;
};

const MultipleAnswers = ({ color, defaultIndexes, optionsTextAndPhoto, onChange=()=>{} }) => (
  <CheckList color={color} onChange={onChange} defaultIndexes={defaultIndexes}>
    {optionsTextAndPhoto.map((obj, i) => (
        <Checkbox key={i} obj={obj}>
            <Text>{obj.text}</Text>           
        </Checkbox>
    ))}
  </CheckList>
);

const SingleAnswer = ({ color, defaultIndexes, optionsTextAndPhoto, onChange=()=>{} }) => (
  <RadioGroup color={color} onChange={i =>  onChange([i])} defaultIndex={defaultIndexes[0]}>
    {optionsTextAndPhoto.map((obj, i) => (
      <Radio key={i} obj={obj}>
        <Text>{obj.text}</Text>
      </Radio>
    ))}
  </RadioGroup>
);

export default MultiChoice;