import Card from "../card";
import Question from "../question";
import { Button } from 'react-native';

const Topic = ({ color="blue", name, questions=[], onAnswerQuestion=()=>{}, onViewIssue=()=>{} }) => {
  const [showChildren, setShowChildren] = useState([]);
  const [test, setTest] = useState(false);

    const handleAnswer = (question) => {
    return async (answer) => {
      onAnswerQuestion({ question, answer });
      if (question.descendants.length !== 0) {
        displayChilden(question, answer);
      }    
    };
  };

   const  displayChilden =  function(question, answer) {
    console.log("INSIDE ASYNC EXECUTING")
    setTimeout(function(){ 
      var itemsToRemove = [...question.descendants, question.id.toString()]

      if(showChildren.find(x => x.id.toString() === question.id.toString()) && question.type == "MultiChoiceQuestion" && !question.multipleAnswers) {
        if(answer.toString().trim() == "") {
          setShowChildren(removeMeAndMyDes(itemsToRemove));          
        } else {
          setShowChildren([...removeMeAndMyDes(itemsToRemove), {'id' : question.id.toString(), 'answer' : answer.toString()}]);                 
        }
      } else if(question.type == "MultiChoiceQuestion" && !question.multipleAnswers) {
          setShowChildren([...showChildren, {'id' : question.id.toString(), 'answer' : answer.toString()}]);
        // ANSWER IS BEING ADDED, BUT WE NEED A RERENDER BASED ON THIS ARRAY
      }
    }, 0)
  }

  const removeMeAndMyDes = (itemsToRemove) => {
    var newArray = showChildren.filter(obj => !itemsToRemove.includes(obj.id.toString()));

    return newArray;
  }

  const onPressLearnMore = () => {
    setTest(!test);
  }

  const renderQuestionCard = (color, props, name, questions, i, showChildren) => {
    let result;
    
    if(props.isChild && contains(props.childResponseTrigger, showChildren.map(a => a.answer))) {
      result = <Card color={color} heading={name} key={i}>
      <Question color={color} onAnswer={handleAnswer(props)} onViewIssue={onViewIssue} {...props} />
    </Card>
    } 
    else if(!props.isChild) {
      result = <Card color={color} heading={name} key={i}>
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
