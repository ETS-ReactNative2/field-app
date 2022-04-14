import RadioGroup, { Radio } from "../radio_group";
import CheckList, { Checkbox } from "../check_list";
import { View } from "react-native";
//field-app/config/host.json


const MultiChoice = ({ interviewMode, color="blue", response, multiChoiceOptions=[], multipleAnswers, onAnswer=()=>{} }) => {

  const optionsTextAndPhoto = multiChoiceOptions.map(o => ({id: o.id, photo: o.photo, text: o.text}));
  let defaultIds = response && [JSON.parse(response.value)].flat() || [];

  if (interviewMode) {
    defaultIds = [];    
  }

  const defaultIndexes = filterIndex(multiChoiceOptions, o => contains(o.id, defaultIds));

  const onChange = (indexes, previousMultiChoiceAnswerIndex) => {
    console.log("onChange in multiChoice");
    console.log("INSIDE ONCHANGE -- index[0]")
    console.log(indexes[0])
    console.log(" ONCHANGE -- previousMultiChoiceAnswerIndex")
    console.log(previousMultiChoiceAnswerIndex)
      let previousMultiChoiceAnswerId = null;

      if (indexes[0] == -1) {
        onAnswer("");
        return;
      }
  
      const ids = indexes.map(index => multiChoiceOptions[index].id);
      ids.sort((a, b) => a - b);
  
      const value = ids.length <= 1 ? (ids[0] || "") : JSON.stringify(ids);
      console.log("AFTER indexes[0] == -1")
      //|| previousMultiChoiceAnswerIndex || (typeof previousMultiChoiceAnswerIndex !== "undefined") 
      if(previousMultiChoiceAnswerIndex == 0 || previousMultiChoiceAnswerIndex) {
        if(previousMultiChoiceAnswerIndex !== -1) {
          console.log("inside if");
          console.log(typeof previousMultiChoiceAnswerIndex);
          console.log(multiChoiceOptions);


          previousMultiChoiceAnswerId = JSON.stringify(multiChoiceOptions[previousMultiChoiceAnswerIndex].id)

          if(value && Array.isArray(JSON.parse(value))) {
            let ansArray = JSON.parse(value)
            ansArray.includes(previousMultiChoiceAnswerId.toString());
            previousMultiChoiceAnswerId = null
          } else if (value.toString() == previousMultiChoiceAnswerId.toString()){
            previousMultiChoiceAnswerId = null
          }
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
           {/* OPTION ID */}
            <Text>{obj.id} - {obj.text}</Text>           
        </Checkbox>
    ))}
  </CheckList>
);

const SingleAnswer = ({ color, defaultIndexes, optionsTextAndPhoto, onChange=()=>{} }) => (
  <RadioGroup color={color} onChange={(i, previousIndex) =>  onChange([i], previousIndex)} defaultIndex={defaultIndexes[0]}>
    {optionsTextAndPhoto.map((obj, i) => (
      <Radio key={i} obj={obj}>
        <Text>{obj.id} - {obj.text}</Text> 
      </Radio>
    ))}
  </RadioGroup>
);

export default MultiChoice;