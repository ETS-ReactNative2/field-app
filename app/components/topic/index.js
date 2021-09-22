import Card from "../card";
import Question from "../question";
import { Button } from 'react-native';

const Topic = ({ color="blue", name, questions=[], onAnswerQuestion=()=>{}, onViewIssue=()=>{} }) => {
  const [showChildren, setShowChildren] = useState([]);
  const [test, setTest] = useState(false);


  const handleAnswer = (question) => {
    return (answer) => {
      var itemsToRemove = [...question.descendants, question.id.toString()]
      console.log("ITEMS TO REMOVE");
      console.log(itemsToRemove);
      if(showChildren.find(x => x.id.toString() === question.id.toString()) && question.type == "MultiChoiceQuestion" && !question.multipleAnswers) {
        if(answer.toString().trim() == "") {
          setShowChildren(removeMeAndMyDes(itemsToRemove));
          //setShowChildren(showChildren.filter(obj => question.id.toString() !== obj.id.toString()));
        } else {
          setShowChildren([...removeMeAndMyDes(itemsToRemove), {'id' : question.id.toString(), 'answer' : answer.toString()}]);
          //showChildren.find(x => x.id === question.id).value = answer.toString();           
        }
      } else if(question.type == "MultiChoiceQuestion" && !question.multipleAnswers) {
          setShowChildren([...showChildren, {'id' : question.id.toString(), 'answer' : answer.toString()}]);
        // ANSWER IS BEING ADDED, BUT WE NEED A RERENDER BASED ON THIS ARRAY
      }
    
      console.log("SHOW CHILDREN");
      console.log(showChildren);
      onAnswerQuestion({ question, answer });
    };
  };

  const removeMeAndMyDes = (itemsToRemove) => {
    var newArray = showChildren.filter(obj => !itemsToRemove.includes(obj.id.toString()));
    
    console.log("ARRAY WITH ITEMS RMEOVED");
    console.log(newArray);
    return newArray;
  }

  const onPressLearnMore = () => {
    setTest(!test);
  }

  const renderQuestionCard = (color, props, name, questions, i, showChildren) => {
    let result;
    let numberOfDes = questions.filter(obj => obj.isChild).length;
    if(props.isChild && contains(props.childResponseTrigger, showChildren.map(a => a.answer))) {
      result = <Card color={color} heading={name} key={i} number={i + 1} outOf={questions.length - numberOfDes + showChildren.length}>
        <Text>{props.id} {name}</Text>
      <Question color={color} onAnswer={handleAnswer(props)} onViewIssue={onViewIssue} {...props} />
    </Card>
    } 
    else if(!props.isChild) {
      result = <Card color={color} heading={name} key={i} number={i + 1} outOf={questions.length - numberOfDes + showChildren.length}>
        <Text>{props.id} {name}</Text>
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
