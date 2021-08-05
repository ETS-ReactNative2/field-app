import "./globals";
import SyncMyDataTask from "./tasks/sync_my_data_task";
import SyncInterviewDataTask from "./tasks/sync_interview_data_task";
import PhotoUploadTask from "./tasks/photo_upload_task";
import FileDownloadTask from "./tasks/file_download_task";
import loadApp from "./workflows/load_app";
import Login from "./screens/login";
import LanguageSelection from "./screens/language_selection";
import Home from "./screens/home";
import Intro from "./screens/intro";
import Project from "./screens/project";
import Source from "./screens/source";
import Issue from "./screens/issue";
import Loading from "./components/loading";
import { Card, ListItem, Button, Icon } from "react-native-elements";
import AnimateLoadingButton from "./components/animated_button";
import deleteIntervieweeData from "./helpers/delete_interviewee_data";

// Create the navigation stack so that you can't go back to the login screen.
const options = { headerMode: "none" };
const AppStack = createStackNavigator(
  { Home, Intro, Project, Source, Issue },
  options
);
const AuthStack = createSwitchNavigator(
  { LanguageSelection, Login, App: AppStack },
  options
);
const AppContainer = createAppContainer(AuthStack);
// These tasks run every 15 minutes when the app is in the background.
SyncMyDataTask.enable({ log: true });
SyncInterviewDataTask.enable({ log: true });
PhotoUploadTask.enable({ log: true });
FileDownloadTask.enable({ log: true });

const App = () => {
  enableScreens();
  const [loaded, setLoaded] = useState();
  const [data, setData] = useState();
  const [interviewMode, setInterviewMode] = useState(false);
  const [interviewee, setInterviewee] = useState(null);

  const [token, setToken] = useSecret("token", () => setData({}));
  const containerRef = useRef();

  const foreground = useForeground();
  const connected = useWifi();

  useEffect(() => {
    loadApp(() => setLoaded(true));
  }, []);

  useWhen(
    [loaded, foreground, token],
    async () => {
      Client.setToken(token); // Ensure the token is definitely set (race condition)

      await SyncMyDataTask.runWith({ connected, callback: setData });
      await SyncInterviewDataTask.runWith({ connected, callback: setData });
      await PhotoUploadTask.runWith({ connected });
      await FileDownloadTask.runWith({ connected });
    },
    [connected]
  );

  //const t = useTranslate();

  // useWhen([locale, timezone], async () => {
  //   useTranslate.setLocale(locale);
  //   Client.setLocale(locale);
  //   Client.setTimezone(timezone);
  // });
  // const handleExitInterviewMode = () => {
  //   inputInterviewRef.current.showLoading(true);
  //   setTimeout(() => {
  //     if (interviewee) {
  //       deleteIntervieweeData(interviewee);
  //       setInterviewee(null);
  //       setInterviewMode(false);
  //       containerRef.current.dispatch(
  //         NavigationActions.navigate({ routeName: "Home" })
  //       );
  //     }
  //   }, 1500);
  // };

  // const renderInterviewPanel = () => {
  //   return (
  //     <Card containerStyle={{marginTop: 40, backgroundColor: palette["blue"].secondary }}>
  //       <Card.Title style={{ color: "white" }}>{t.interview_banner}</Card.Title>
  //       <Card.Divider />
  //       <View style={{marginBottom: 25}}>
  //         <Text style={{ color: "white" }}>
  //           {t.interview_banner_message}
  //         </Text>
  //       </View>
  //       <AnimateLoadingButton
  //         ref={inputInterviewRef}
  //         width={350}
  //         height={40}
  //         title={t.interview_banner_button}
  //         titleFontSize={14}
  //         titleWeight={"100"}
  //         titleColor="white"
  //         backgroundColor={palette["black"].primary}
  //         borderRadius={4}
  //         onPress={handleExitInterviewMode}
  //       />
  //     </Card>
  //   );
  // };

  if (!loaded || !data) return <Loading />;

  return (
    <AppContext.Provider
      value={{
        data,
        setData,
        token,
        setToken,
        connected,
        interviewMode,
        interviewee,
        setInterviewMode,
        setInterviewee,
      }}
    >

      <View style={{ flex: 1 }} {...className("root")}>
        <AppContainer ref={containerRef} />
      </View>
    </AppContext.Provider>
  );
};

export default App;
