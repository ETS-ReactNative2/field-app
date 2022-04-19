import Card from "../card";
import Question from "../question";
import deleteLinageFromDB from "../../helpers/delete_linage_from_db";
import { Button } from 'react-native';

const Topic = ({ color="blue", name, questions=[], onAnswerQuestion=()=>{}, onViewIssue=()=>{} }) => {
  const [showChildren, setShowChildren] = useState([]);
  const [test, setTest] = useState(false);

    const handleAnswer = (question, previousSelection) => {
    return async (answer, previousSelection) => {
      onAnswerQuestion({ question, answer }, previousSelection);
      var hasDescendants = question.descendants.length !== 0;
      if (hasDescendants) {
        displayChilden(question, answer, previousSelection);
      }    
    };
  };

   const  displayChilden =  function(question, answer, previousSelection) {
     //console.log("22. ANSWER")
     //console.log(answer)
     // answer can be blank or the id of a multioption selection
    setTimeout(function(){ 
      if  (question.type == "MultiChoiceQuestion") { 
        // console.log("1. WHO ARE MY DESCENDANTS?")
        // console.log(question.li);

        if(answer.toString().trim() == "") {
          // according to responseTrigger, Remove the whole linage of this question
          console.log("excuting EMPTY STRING PART--")
          //removeChildWithParentIdAndChildResponseTrigger(question.id, previousSelection)          
          setShowChildren(removeLinage(question, previousSelection, answer.toString().trim()));
        } else {
          if(Array.isArray(JSON.parse(answer))){
            //remove accoring to linage
            console.log("1. excuting ARRAY PART")
            //removeLinage(question, previousSelection);
            let data = JSON.parse(answer).map(x => ({'parentId': question.id.toString(), 'childResponseTrigger': x.toString()}))
            // remove duplicates
            let arr = [...removeLinage(question, previousSelection), ...data].filter((v,i,a)=>a.findIndex(t=>(t.childResponseTrigger === v.childResponseTrigger && t.parentId===v.parentId))===i)
            setShowChildren(arr)
          } else {
            console.log("2. excuting SINGLE PART")
            //removeLinage(question, previousSelection);
            setShowChildren([...removeLinage(question, previousSelection, answer.toString().trim()), {'parentId': question.id.toString(), 'childResponseTrigger':answer.toString()}])
          }
        }
      }// end of MultiChoiceQuestion if
    }, 0)
  }

  const removeLinage = (question, childResponseTriggerLinage, currentAnswer, type="EMPTY STRING") => {
    let results = []
    let bad = []

     console.log("SHOW CHILDREN BEFORE ANYTHING HAPPENS")
     console.log(showChildren)
    // console.log("previous selection")
    // console.log(childResponseTriggerLinage)
    // if value empty then remove every response trigger
    if(currentAnswer == ""){
      results = showChildren.filter((el) => {
        return Object.entries(question.linage).every((linage) => {
          return linage[1].every((f) => {
            if (!(f.parentId.toString() === el.parentId.toString() && f.childResponseTrigger.toString() === el.childResponseTrigger.toString())) {
              return el;
            } else {
              bad.push(el.childResponseTrigger);
            }         
          });
        });
      }); 
    } else if(childResponseTriggerLinage != null) {
      let linage = question.linage[childResponseTriggerLinage.toString()]
      // console.log("linage value, previous selected -- ")
      // console.log(childResponseTriggerLinage)
      
      // console.log("LINAGE");
      // console.log(linage)
      // console.log("showChildren ");
      // console.log(showChildren)
      if (typeof linage == "undefined") {
        return showChildren;
      }
      // remove linage from showchildren
      // if(showChildren.length == 1){
      //   results = [] 
      // } else {// Array of elements

        results = showChildren.filter((el) => {
          return linage.every((f) => {
            if (!(f.parentId.toString() === el.parentId.toString() && f.childResponseTrigger.toString() === el.childResponseTrigger.toString())) {
              return el;
            } else {
              bad.push(el.childResponseTrigger);
            }
          });
        });      
      //}
    } else {
      results = showChildren;
    }
    console.log("CHILDREN TO GET EMPTY STRING VALUES");
    deleteLinageFromDB(bad).then((value) => {
      console.log("WE DONE HERE BABY")
      console.log(value);
      // expected output: "Success!"
    });
  
    return results
  }

  const removeChildWithParentId = (parentId) => {
    var newArray = showChildren.filter(obj => !(obj.parentId.toString() == parentId.toString()));
    // console.log("NEW ------ARRAY")
    // console.log(newArray);
    return newArray;
  }

  const removeChildWithParentIdAndChildResponseTrigger = (parentId, childResponseTrigger) => {
    var newArray = showChildren.filter(obj => !(obj.parentId.toString() == parentId.toString() && obj.childResponseTrigger.toString() == childResponseTrigger.toString()));
    // console.log("NEW ------ARRAY")
    // console.log(newArray);
    return newArray;
  }

  const onPressLearnMore = () => {
    setTest(!test);
  }

  function shouldChildBeDisplayed(childQuestion) {
    // console.log("1. SHOW CHILDREN");
    // console.log(showChildren);

    let result = showChildren.some(obj => {
                return (childQuestion.childResponseTrigger == obj.childResponseTrigger) && (childQuestion.parentProjectQuestionId == obj.parentId)
              });
    return result;
  }

  const renderQuestionCard = (color, props, name, questions, i, showChildren) => {
    let result;
    // if(i==0){
    // console.log("SHOW CHILDREN IN RENDER QUESTION CARD")
    // console.log(showChildren);
    // }
    // render question if it a child and if ShowChildren contains my child response trigger
    if(props.isChild && shouldChildBeDisplayed(props)) {
      result = <Card color={color} heading={name} key={i}>
         {/* QUESTION ID */}
        {/* <Text>{props.id}</Text> */}
      <Question color={color} onAnswer={handleAnswer(props)} onViewIssue={onViewIssue} {...props} />
    </Card>
    } 
    else if(!props.isChild) {
      result = <Card color={color} heading={name} key={i}>
        {/* <Text>{props.id}</Text> */}
        <Question color={color} onAnswer={handleAnswer(props)} onViewIssue={onViewIssue} {...props} />
      </Card>
    }
    return result;
  };

  return (
    questions.map((props, i) => (      
      renderQuestionCard(color, props, name, questions, i, showChildren)
     )
    )
  );
};

export default Topic;
