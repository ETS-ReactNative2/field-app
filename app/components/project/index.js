import Activity from "../activity";
import Sticky from "../sticky";
import Summary from "../summary";
import AnimateLoadingButton from "../animated_button";
import pushData from "../../workflows/push_data";


const Project = ({
  navigation,
  index,
  name,
  projectActivities = [],
  sourceMaterials = [],
  currentProjectActivity = {},
  onViewSource = () => {},
  onAnswerQuestion = () => {},
  onViewIssue = () => {},
}) => {
  const doneRef = useRef(null);
  const projectColor = palette.cycle(index);
  const activityColor = (i) => palette.cycle(index + i);
  const isCurrent = (id) => id === (currentProjectActivity || {}).id;
  const { setInterviewMode, setInterviewee } = useContext(AppContext);
  const t = useTranslate();

  const hasContract = sourceMaterials.length > 0;
  const viewContract = () =>
    onViewSource({ ...sourceMaterials[0], color: projectColor });


  const handlePress = () => {
    doneRef.current.showLoading(true);    
    setTimeout(() => {
      if (true) {               
        console.log("Navigating home");     
        console.log("INTERVIEW MODE OFF: Now pushing data");
        setInterviewee(null)
        setInterviewMode(false);              
        pushData({interviewMode: false});  
        useTranslate.unsetProject();             
        navigation.navigate("Home");        
      } 
    }, 1000);
  };
  
  return (
    <Sticky.Container>      
      <Summary
        color={projectColor}
        projectName={name}
        hasContract={hasContract}
        onViewContract={viewContract}
      />
      {projectActivities.map(({ id, ...props }, i) =>
        Activity({
          color: activityColor(i),
          isCurrent: isCurrent(id),
          onAnswerQuestion,
          onViewIssue,
          ...props,
        })
      )}
    <View  style={{marginTop: 20, marginBottom: 40}}>
        <AnimateLoadingButton
          ref={doneRef}
          width={350}
          height={40}
          title={t.done}
          titleFontSize={14}
          titleWeight={"100"}
          titleColor="white"
          backgroundColor={palette[projectColor].primary}
          borderRadius={4}
          onPress={handlePress}
        />
      </View>
    </Sticky.Container>
  );
};

export default Project;
