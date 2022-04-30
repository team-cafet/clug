import HTTPService from "./HTTPService";

interface IUserInfo {
  id: number;
  username:string;
}

class AuthService extends HTTPService {
  protected readonly API_URL = '/api/backoffice/auth';
  protected readonly LS_BACKOFFICE_USER_INFO = 'LS_BACKOFFICE_USER_INFO';
  protected readonly LS_TOKEN = 'LS_TOKEN';

  constructor() {
    super();
  }

  public async login(username: string, password: string): Promise<{user: IUserInfo, token: string}> {
    const result = await this.post(`${this.API_URL}/login`, { username, password });

    const data: { user: IUserInfo, token: string } = result?.data;
    this.saveUserToLocalstorage(data.token, data.user);
    
    return data;
  }
  
  public getSavedUser(): {user: IUserInfo, token: string} | null {
    
    const user = JSON.parse(localStorage.getItem(this.LS_BACKOFFICE_USER_INFO) ?? '{}');
    const token = localStorage.getItem(this.LS_TOKEN) ?? '';
    
    if(!user || !token) {
      return null;
    }

    return {
      user,
      token,
    };
  }
  
  protected saveUserToLocalstorage(token:string, info: IUserInfo) {
    localStorage.setItem(this.LS_BACKOFFICE_USER_INFO, JSON.stringify(info ?? {}));
    localStorage.setItem(this.LS_TOKEN, token ?? '');
  }

}

export default AuthService;
