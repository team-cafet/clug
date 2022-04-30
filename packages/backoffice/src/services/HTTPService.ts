import axios, { Axios, AxiosRequestConfig } from "axios";

class HTTPService {
  protected axiosInstance: Axios;
  
  constructor(config?: AxiosRequestConfig) {
    this.axiosInstance = axios.create(config ?? {});
  }
  
  public async get(url: string, config?: AxiosRequestConfig) {
    return this.axiosInstance.get(url, config);
  }

  public async post(url: string, data: any, config?: AxiosRequestConfig) {
    return this.axiosInstance.post(url, data, config ?? {});
  }
}

export default HTTPService;
