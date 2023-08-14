import axios from "axios";

class AxiosService {
  constructor() {
    const instance = axios.create();
    instance.interceptors.response.use(this.handleSuccess, this.handleError);
    this.instance = instance;
  }

  handleSuccess(resp) {
    return resp;
  }

  handleError(err) {
    return Promise.reject(err);
  }

  get(url, headers) {
    return this.instance.get(url, { headers });
  }

  post(url, body, headers, onUploadProgress) {
    return this.instance.post(url, body, { headers, onUploadProgress });
  }

  put(url, body, headers) {
    return this.instance.put(url, body, { headers });
  }
}

export default new AxiosService();
