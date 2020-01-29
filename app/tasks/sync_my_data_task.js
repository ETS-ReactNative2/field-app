import BackgroundTask from "./background_task";
import pushData from "../workflows/push_data";
import pullData from "../workflows/pull_data";
import Secret from "../helpers/secret";
import hasWifi from "../helpers/has_wifi";

class SyncMyDataTask extends BackgroundTask {
  static name() {
    return "SyncMyDataTask";
  }

  static async run() {
    const connected = await hasWifi();

    const token = await Secret.read("token");
    if (!token) return false;

    Client.setToken(token);

    return await this.runWith({ connected });
  }

  static async runWith({ connected, force, callback=()=>{} } = {}) {
    if (!connected) return false;

    const dataWasPushed = await pushData();

    const forcePull = force || dataWasPushed;
    const dataWasPulled = await pullData({ force: forcePull, callback });

    return dataWasPushed || dataWasPulled;
  }
};

export default SyncMyDataTask;
