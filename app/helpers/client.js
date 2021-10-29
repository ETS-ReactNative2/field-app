import Base64 from "Base64";
import Constants from "expo-constants";
import { host } from "../../config/host.json";

// Make sure this key exists so the test suite doesn't fail.
Constants.manifest.android = Constants.manifest.android || {};

class Client {
  static headers = {
    "Field-App": JSON.stringify({
      device_id: Constants.deviceId,
      device_name: Constants.deviceName,
      device_year_class: Constants.deviceYearClass,
      app_version: Constants.manifest.version,
      app_version_code: Constants.manifest.android.versionCode,
    }),
  };

  static setToken(token) {
    this.headers.Authorization = `Basic ${Base64.btoa(`:${token}`)}`;
  }

  // static async setLocale(locale, bk) {
  //   if(bk){
  //     console.log("LOCALE PICKED IN BACKGROUND TASK");
  //     console.log(locale);
  //   }        
  //   let value = await AsyncStorage.getItem('locale');
  //   console.log("LOCALE VALUE from async storage");
  //   console.log(value);
  //   this.headers["Accept-Language"] = value;
  // }

  static setTimezone(timezone) {
    this.headers["Time-Zone"] = timezone;
  }

  getMyData() {
    return this.getJSON("/my_data");
  }

  async getSupportedLanguages(){
    let path = "/translations/supported_locales";
    const response = await fetch(`${host}${path}`, { headers: Client.headers });
    const data = await response.json();
    return data;    
  }  

  postMyUpdates(updates) {
    return this.postJSON("/my_updates", { updates });
  }

  // Ideally, we'd issue a HEAD to /my_photos/filename and check for a 3xx but
  // react-native always follows the redirect, even with { redirect: "manual" }
  getPhotoExists(image) {
    const id = image.name.replace(".", "-");
    return this.getJSON(`/my_photos/${id}/exists`);
  }

  postMyPhotos(image) {
    return this.postFile("/my_photos", { image });
  }

  postChangeRoles(projectRole) {
    return this.postJSON(`/change_roles`, { id: projectRole.id })
  }

  postTokens(phoneNumber) {
    return this.postJSON("/tokens", { phoneNumber });
  }

  async getJSON(path) {
    const locale = await AsyncStorage.getItem('locale');    
    //{"Accept-Language": locale, ...Client.headers}
    const response = await fetch(`${host}${path}`, { headers: {...Client.headers, "Accept-Language": locale} });

    if (this.isError(response)) {
      throw new Error(`GET ${path} failed with a ${response.status} status`);
    }

    const data = await response.json();
    return camelCaseKeys(data, { deep: true });
  }

  async postJSON(path, data) {
    data = snakeCaseKeys(data, { deep: true });
    data = JSON.stringify(data);

    return await this.post(path, "application/json", data);
  }

  async postFile(path, data) {
    data = snakeCaseKeys(data, { deep: true });
    data = this.toFormData(data);

    return await this.post(path, "multipart/form-data", data);
  }

  async post(path, contentType, body) {
    const locale = await AsyncStorage.getItem('locale');
    //, "Accept-Language": locale
    const response = await fetch(`${host}${path}`, {
      method: "POST",
      headers: { ...Client.headers, "Content-Type": contentType, "Accept-Language": locale},
      body,
    });

    if (this.isError(response)) {
      throw new Error(`POST ${path} failed with a ${response.status} status`);
    }

    try {
      const data = await response.json();
      return camelCaseKeys(data, { deep: true });
    } catch {
      return {};
    }
  }

  isError(response) {
    return response.status >= 400;
  }

  toFormData(data) {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    return formData;
  }
}

export default Client;
