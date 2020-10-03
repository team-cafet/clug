import React, { useEffect, useContext } from 'react';
import {
  GlobalContext,
  GlobalContextActions,
} from '../../contexts/GlobalContext';

export const Logout = () => {
  const globalCtxt = useContext(GlobalContext);

  useEffect(() => {
    if (globalCtxt?.state.isAuthentified) {
      globalCtxt?.dispatch({ type: GlobalContextActions.LOGOUT });
    }
  }, [globalCtxt]);

  return (
    <>
      <h1>A bientôt !</h1>
    </>
  );
};
