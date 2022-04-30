import create from 'zustand'
import AuthService from '../services/AuthService';

type userState = {
  isUserLogged: () => boolean,
  login: (username: string, password: string) => Promise<any>,
};

const useUserStore = create<userState>((set, get) => ({
  
  isUserLogged: () =>  (new AuthService).getSavedUser() ? true : false,
  
  login: async (username: string, password: string) => {
    return (new AuthService).login(username, password);
  }
}))

export default useUserStore;
