import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GlobalContext,
  GlobalContextActions,
} from '../../contexts/GlobalContext';

export const Logout = () => {
  const navigate = useNavigate();
  const globalCtxt = useContext(GlobalContext);
  useEffect(() => {
    if (globalCtxt?.state.isAuthentified) {
      globalCtxt?.dispatch({ type: GlobalContextActions.LOGOUT });
    }

    navigate('/login');
  }, [globalCtxt, navigate]);


  return (
    <>
      <h1>A bientôt !</h1>
    </>
  );
};
