import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import * as Localization from "expo-localization";

const Result = BackgroundFetch.Result;

// TODO: Currently, the background task doesn't run if the app has terminated
// or after the phone reboots due to a bug in expo.
//
// Tracking issue: https://github.com/expo/expo/issues/3582

class BackgroundTask {
  static name() {
    throw new Error("Implement me");
  }

  // Make this method return true if new data was fetched.
  static async run() {
    throw new Error("Implement me");
  }

  static enable({ log=false } = {}) {
    const name = this.name();
    const options = { stopOnTerminate: false, startOnBoot: true };
    const interval = 15; // minutes;

    log && Logger.log(`Defining ${name} background task...`);
    TaskManager.defineTask(name, () => this.runSafely(name, log));

    return BackgroundFetch.registerTaskAsync(name, options).then(() => {
      BackgroundFetch.setMinimumIntervalAsync(interval);
      log && Logger.log(`Successfully registered ${name} background task`);
    });
  }

  static async runSafely (name, log) {
    log && Logger.log(`Running ${name} background task...`);

    // Background tasks run in a separrate process so we need to set global state.
    const { locale, timezone } = await Localization.getLocalizationAsync();
    // I NEED TO SET LOCALE HERE
    //Client.setLocale(locale, true);
    Client.setTimezone(timezone);

    try {
      const bool = await this.run();
      return bool ? Result.NewData : Result.NoData;

    } catch (error) {
      log && Logger.warn(`Error running ${name} background task:`, error);
      return Result.Failed;
    }
  }
}

export default BackgroundTask;
