import SyncMyDataTask from "../tasks/sync_my_data_task";
import SyncInterviewDataTask from "../tasks/sync_interview_data_task";
import PhotoUploadTask from "../tasks/photo_upload_task";
import FileDownloadTask from "../tasks/file_download_task";
import Layout from "../components/layout";
import LoginForm from "../components/login_form";
import NoWifi from "../components/no_wifi";
import Loading from "../components/loading";

// These tasks run every 15 minutes when the app is in the background.
// AsyncStorage.getItem('locale').then((value) => {
//   if (value) {
//     console.log("LOGIN FILE THIS IS THE LOCALE");
//     console.log(value); // null
//     SyncMyDataTask.enable({ log: true });
//     SyncInterviewDataTask.enable({ log: true });
//     PhotoUploadTask.enable({ log: true });
//     FileDownloadTask.enable({ log: true });
//   }
// });

const Login = ({ navigation }) => {
  
  const { token, setToken, data, connected, foreground, loaded } = useContext(AppContext);
  const [error, setError] = useState(false);

  useWhen([token], () => {
    Client.setToken(token);

    if (data.projects) {
      navigation.navigate("App");
    }
  }, [data]);

  // useWhen(
  //   [loaded, foreground, token],
  //   async () => {
  //     Client.setToken(token); // Ensure the token is definitely set (race condition)

  //     await SyncMyDataTask.runWith({ connected, callback: setData });
  //     await SyncInterviewDataTask.runWith({ connected });
  //     await PhotoUploadTask.runWith({ connected });
  //     await FileDownloadTask.runWith({ connected });
  //   },
  //   [connected]
  // );

  const handleSubmit = async (phone) => {
    setError(false);

    const token = await generateToken(phone);
    token ? setToken(token) : setError(true)
  };

  const generateToken = async (phone) => {
    try {
      const { token } = await new Client().postTokens(phone);
      return token;
    } catch (error) {
      if (authFailed(error)) return null;
      throw error;
    }
  };

  const authFailed = (error) => (
    error && error.message && error.message.includes("401")
  );

  if (token) return <Loading />;
  if (!connected) return <NoWifi />;

  return <LoginForm onSubmit={handleSubmit} error={error} route={navigation.state.routeName}/>;
};

export default Login;
