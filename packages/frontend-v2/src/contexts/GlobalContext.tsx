import React, { useReducer } from 'react';
import { getUserConfig } from '../services/auth.service';

interface IProps {
  children: any;
}

interface IGlobalContextState {
  userConfig: any;
}

interface IGlobalContextAction {
  type: GlobalContextActions;
  payload?: any;
}

export enum GlobalContextActions {
  LOAD_USER_CONFIG,
}

export const loadUserConfig = (
  state: IGlobalContextState
): IGlobalContextState => {
  const userConfig = getUserConfig();

  return { ...state, userConfig };
};

const INITIAL_STATE: IGlobalContextState = {
  userConfig: null,
};

export const GlobalContext = React.createContext<{
  state: IGlobalContextState;
  dispatch: React.Dispatch<IGlobalContextAction>;
} | null>(null);

export const GlobalContextProvider = (props: IProps) => {
  const [state, dispatch] = useReducer(
    (state: IGlobalContextState, action: IGlobalContextAction) => {
      switch (action.type) {
        case GlobalContextActions.LOAD_USER_CONFIG:
          loadUserConfig(state);
          return state;
        default:
          return state;
      }
    },
    INITIAL_STATE
  );

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {props.children}
    </GlobalContext.Provider>
  );
};
