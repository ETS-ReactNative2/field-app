import * as Sentry from "sentry-expo";
import { dsn } from "../../config/sentry.json";
import Constants from "expo-constants";

const initializeSentry = () => {
  
  Sentry.init({
    // integrations: [
    //   new RewriteFrames({
    // //     iteratee: (frame) => {
    // //       if (frame.filename) {
    // //         // the values depend on what names you give the bundle files you are uploading to Sentry
    // //         frame.filename = 'app:///main.android.bundle';
    // //       }
    // //       return frame;
    // //     },
    // //   }),
    // // ],
    dsn: dsn,
    enableInExpoDevelopment: false,
    release: Constants.manifest.revisionId,
    debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  });
   // Access any @sentry/react-native exports via:
  //Sentry.Native.*

  // Access any @sentry/browser exports via:
  //Sentry.Browser.*
  };

export default initializeSentry;

