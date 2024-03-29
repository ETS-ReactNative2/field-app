import Button from "../button";
import RoleListing from "../role_listing";
import styles from "./styles.js";
import AnimateLoadingButton from "../animated_button";

const Intro = ({ interviewMode, setInterviewee=()=>{}, setInterviewMode=()=>{}, color="blue", project, page=1, onNextPage=()=>{}, onFinish=()=>{} }) => {
  const s = styles(color);
  const t = useTranslate();
  const inputRef = useRef(null);
  const introRef = useRef(null);

  const [disabled, setDisabled] = useState(false);
  const [role, setRole] = useState();

  const markdown = t.intro[`page_${page + 1}`];
  const hasNextPage = markdown && markdown.length >= 10;

  const buttonText = hasNextPage ? t.intro.next_page : t.intro.finish;
  const handlePress = () => {
    inputRef.current.showLoading(true);    
    setTimeout(
      () => { 
        if(hasNextPage) {
          onNextPage(role)
         } else {
          onFinish(role);
         }
        }
    , 1300);

    
  }
{/* <View style={{marginTop: 15 }}>
</View> */}
  const interviewModeButton = () => {
    return (
      <AnimateLoadingButton
        ref={introRef}
        width={350}
        height={40}
        title={t.interview_mode_intro_button}
        titleFontSize={14}
        titleWeight={'100'}
        titleColor="white" 
        backgroundColor={palette[color].secondary}
        borderRadius={4}
        onPress={handleInterviewMode}
      />
    );
  }

  const handleInterviewMode = async () => {
    introRef.current.showLoading(true);     
    let id = await uuid();
    setInterviewee(id);    
    setTimeout(
      () => { 
        setInterviewMode(true);
        if(hasNextPage) {          
          onNextPage(role)          
         } else {
          onFinish(role);
         }
        }
    , 1500);   
  }

  const resolveMarker = (node, children, parent, styles) => {
    if (innerContent(node) === "%{roles}") {
      return <RoleListing key={0} color={color} project={project} role={role} onSelect={setRole} disableSubmit={setDisabled} />
    }
  };

  return (
    <ScrollView {...className("intro", s)}>
      <Markdown style={s.markdown} rules={{ heading6: resolveMarker }}>
        {t.intro[`page_${page}`]}
      </Markdown>

        {project.projectRoles.some(i => i.displayName.includes('interviewer')) && !interviewMode ? interviewModeButton() : null}
        {<View {...className("button")}>
        <AnimateLoadingButton
          ref={inputRef}
          width={350}
          height={40}
          title={buttonText}
          titleFontSize={14}
          titleWeight={'100'}
          titleColor="white" 
          backgroundColor={palette[color].primary}
          borderRadius={4}
          onPress={handlePress}
        />
      </View> }
    </ScrollView>
  );
};

export default Intro;
