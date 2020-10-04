import React, { useReducer, useEffect } from 'react';
import { getToken } from '../services/auth.service';
import { logout } from '../services/auth.service';

interface IProps {
  children: any;
}

interface IGlobalContextState {
  isAuthentified: boolean;
}

interface IGlobalContextAction {
  type: GlobalContextActions;
  payload?: any;
}

export enum GlobalContextActions {
  INIT_APP,
  HAS_LOGIN,
  LOGOUT,
}

const INITIAL_STATE: IGlobalContextState = {
  isAuthentified: false,
};

export const GlobalContext = React.createContext<{
  state: IGlobalContextState;
  dispatch: React.Dispatch<IGlobalContextAction>;
} | null>(null);

export const GlobalContextProvider = (props: IProps) => {
  const [state, dispatch] = useReducer(
    (state: IGlobalContextState, action: IGlobalContextAction) => {
      switch (action.type) {
        case GlobalContextActions.INIT_APP:
          return { ...state, isAuthentified: getToken() !== null };

        case GlobalContextActions.HAS_LOGIN:
          return { ...state, isAuthentified: true };

        case GlobalContextActions.LOGOUT:
          logout();
          return INITIAL_STATE;

        default:
          return state;
      }
    },
    INITIAL_STATE
  );

  useEffect(() => dispatch({ type: GlobalContextActions.INIT_APP }), []);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {props.children}
    </GlobalContext.Provider>
  );
};
