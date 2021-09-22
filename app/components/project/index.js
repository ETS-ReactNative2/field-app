import Activity from "../activity";
import Sticky from "../sticky";
import Summary from "../summary";
import AnimateLoadingButton from "../animated_button";
import pushInterviewData from "../../workflows/push_interview_data";
import Response from "../../models/response";

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
  const { setInterviewMode, setInterviewee, interviewee, interviewMode } =
    useContext(AppContext);
  const t = useTranslate();

  const hasContract = sourceMaterials.length > 0;
  const viewContract = () =>
    onViewSource({ ...sourceMaterials[0], color: projectColor });

  const handlePress = () => {
    doneRef.current.showLoading(true);
    setTimeout(async () => {
      if (true) {
        console.log("Navigating home");
        if (interviewMode) {
          console.log("INTERVIEW MODE OFF: Now pushing data");
          await Response.update(
            { interviewComplete: true },
            {
              where: {
                intervieweeId: interviewee,
              },
            }
          );
          useTranslate.unsetProject();
          setInterviewee(null);
          setInterviewMode(false);
          pushInterviewData();
        }
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
      <View style={{ marginTop: 20, marginBottom: 40 }}>
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
