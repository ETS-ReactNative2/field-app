import Layout from "../components/layout";
import ProjectComponent from "../components/project";
import answerQuestion from "../workflows/answer_question";
import { Card, ListItem, Button, Icon } from "react-native-elements";
import deleteIntervieweeData from "../helpers/delete_interviewee_data";
import AnimateLoadingButton from "../components/animated_button";

const Project = ({ navigation }) => {
  const {
    data,
    connected,
    interviewee,
    interviewMode,
    setInterviewMode,
    setInterviewee,
  } = useContext(AppContext);

  const inputInterviewRef = useRef(null);
  const index = navigation.getParam("projectIndex");
  const project = data.projects[index];
  const t = useTranslate();

  useBack(navigation, () => {
    if(interviewMode){
      Alert.alert(
        "Alert!",
        "Complete session or exit interview mode from top of screen",
        [
          {
            text: "Ok",
            onPress: () => null,
            style: "cancel",
          },
        ]
      );
    } else {
      useTranslate.unsetProject(); // Don't use project-specific translations.
      navigation.navigate("Home");
    }
  });

  const handleExitInterviewMode = () => {
    inputInterviewRef.current.showLoading(true);
    setTimeout(() => {
      if (interviewee) {
        useTranslate.unsetProject();
        deleteIntervieweeData(interviewee);
        setInterviewee(null);
        setInterviewMode(false);
        navigation.navigate("Home");
      }
    }, 900);
  };

  const renderInterviewPanel = () => {
    return (
      <Card
        containerStyle={{
          marginTop: 40,
          backgroundColor: palette["blue"].secondary,
        }}
      >
        <Card.Title style={{ color: "white" }}>{t.interview_banner}</Card.Title>
        <Card.Divider />
        <View style={{ marginBottom: 25 }}>
          <Text style={{ color: "white" }}>{t.interview_banner_message}</Text>
        </View>
        <AnimateLoadingButton
          ref={inputInterviewRef}
          width={350}
          height={40}
          title={t.interview_banner_button}
          titleFontSize={14}
          titleWeight={"100"}
          titleColor="white"
          backgroundColor={palette["black"].primary}
          borderRadius={4}
          onPress={handleExitInterviewMode}
        />
      </Card>
    );
  };

  const handleAnswer = ({ question, answer }) => {
    answerQuestion({ connected, question, answer, interviewee, interviewMode });
  };

  const handleViewIssue = ({ color, questionId, issueUuid }) => {
    navigation.navigate("Issue", { color, questionId, issueUuid });
  };

  const handleViewSource = (sourceMaterial) => {
    navigation.navigate("Source", sourceMaterial);
  };

  return (
    <Layout>
      {interviewMode ? renderInterviewPanel() : null}
      <ProjectComponent
        navigation={navigation}
        index={index}
        onAnswerQuestion={handleAnswer}
        onViewIssue={handleViewIssue}
        onViewSource={handleViewSource}
        {...project}
      />
    </Layout>
  );
};

export default Project;
