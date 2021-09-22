import BackgroundTask from "./background_task";
import pushInterviewData from "../workflows/push_interview_data";
import pullData from "../workflows/pull_data";
import Secret from "../helpers/secret";
import hasWifi from "../helpers/has_wifi";

class SyncInterviewDataTask extends BackgroundTask {
  static name() {
    return "SyncInterviewDataTask";
  }

  static async run() {
    const connected = await hasWifi();

    const token = await Secret.read("token");
    if (!token) return false;

    Client.setToken(token);

    return await this.runWith({ connected });
  }

  static async runWith({ connected } = {}) {
    const interviewDataWasPushed = connected ? await pushInterviewData() : false;    
    return connected && (interviewDataWasPushed);
  }
};

export default SyncInterviewDataTask;
