import { LogBox } from 'react-native';
//import catchGlobalErrors from "./app/helpers/global_errors";
import initializeSentry from "./app/helpers/sentry";

// Capture exceptions and send them to Sentry. Do this before loading anything.
initializeSentry();

// Show a friendly message (instead of crashing) if something goes wrong.
//catchGlobalErrors();

export { default } from "./app/index";
LogBox.ignoreLogs(['Animated: `useNativeDriver` was not specified.']);
// deploy changes test Chanda