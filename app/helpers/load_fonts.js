import * as Font from "expo-font";

const loadFonts = async (callback) => {
  await Font.loadAsync({
    "Roboto-Medium": require("../assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Medium-Italic": require("../assets/fonts/Roboto-Medium-Italic.ttf"),
  });

  callback();
};

export default loadFonts;