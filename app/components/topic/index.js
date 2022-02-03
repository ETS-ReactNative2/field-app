import Card from "../card";
import Question from "../question";
import { Button } from 'react-native';

const Topic = ({ color="blue", name, questions=[], onAnswerQuestion=()=>{}, onViewIssue=()=>{} }) => {
  const [showChildren, setShowChildren] = useState([]);
  const [test, setTest] = useState(false);

    const handleAnswer = (question) => {
    return async (answer, previousSelection) => {
      onAnswerQuestion({ question, answer }, previousSelection);
      var hasDescendants = question.descendants.length !== 0;
      if (hasDescendants) {
        displayChilden(question, answer, previousSelection);
      }    
    };
  };

   const  displayChilden =  function(question, answer, previousSelection) {
     console.log("22. ANSWER")
     console.log(answer)
     // answer can be blank or the id of a multioption selection
    setTimeout(function(){ 
      if  (question.type == "MultiChoiceQuestion") { 
        // console.log("1. WHO ARE MY DESCENDANTS?")
        // console.log(question.li);

        if(answer.toString().trim() == "") {
          // according to responseTrigger, Remove the whole linage of this question
          console.log("excuting EMPTY STRING PART")
          //removeChildWithParentIdAndChildResponseTrigger(question.id, previousSelection)
          
          setShowChildren(removeLinage(question, previousSelection));
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
            let childrenWithOutMyChildren = removeChildWithParentId(question.id);
            setShowChildren([...removeLinage(question, previousSelection), {'parentId': question.id.toString(), 'childResponseTrigger':answer.toString()}])
          }
        }
      }// end of MultiChoiceQuestion if
    }, 0)
  }

  const removeLinage = (question, childResponseTriggerLinage) => {
    let results = []
    // if value empty then remove every response trigger
    if(childResponseTriggerLinage != null) {
      console.log("linage value, previous selected -- ")
      console.log(childResponseTriggerLinage)
      let linage = question.linage[childResponseTriggerLinage.toString()]
      console.log("LINAGE");
      console.log(linage)
      console.log("showChildren");
      console.log(showChildren)
      // remove linage from showchildren
      // if(showChildren.length == 1){
      //   results = [] 
      // } else {
        results = showChildren.filter((el) => {
          return linage.every((f) => {
            return !(f.parentId.toString() === el.parentId.toString() && f.childResponseTrigger.toString() === el.childResponseTrigger.toString());
          });
        });      
      //}

      console.log("SHOW CHIDLREN - AFTER LINAGE REMOVED")
      console.log(results)
    }
  
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
    
    // render question if it a child and if ShowChildren contains my child response trigger
    if(props.isChild && shouldChildBeDisplayed(props)) {
      result = <Card color={color} heading={name} key={i}>
        <Text>{props.id}</Text>
      <Question color={color} onAnswer={handleAnswer(props)} onViewIssue={onViewIssue} {...props} />
    </Card>
    } 
    else if(!props.isChild) {
      result = <Card color={color} heading={name} key={i}>
        <Text>{props.id}</Text>
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
