import * as Updates from 'expo-updates';
import { AsyncStorage } from 'react-native';

const resetEverything = async () => {
  // Reset the database.
  await sequelize.sync({ force: true });

  // Delete everything in /documents.
  const paths = await File.listing();
  const removes = paths.map(p => File.remove(p, { force: true }));
  await Promise.all(removes);

  // Delete the API token.
  await Secret.remove("token");
  await AsyncStorage.removeItem('locale');
  // Abandon in-progress downloads.
  if (Download.inProgress()) {
    await Download.pause();
    await Download.reset();
  }

  // Restart the app.
  Updates.reloadAsync();
};

export default resetEverything;
