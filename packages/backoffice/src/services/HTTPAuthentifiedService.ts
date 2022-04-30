import axios, { Axios, AxiosRequestConfig } from "axios";
import AuthService from "./AuthService";
import HTTPService from "./HTTPService";

class HTTPAuthentifiedService extends HTTPService {
  protected authService: AuthService;

  constructor() {
    super();
    
    this.authService = new AuthService();
    const token = this.authService.getSavedUser()?.token;
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}

export default HTTPAuthentifiedService ;
