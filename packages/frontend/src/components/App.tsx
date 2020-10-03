import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes } from '../routes/routes';
import { GlobalContextProvider } from '../contexts/GlobalContext';

interface IProps {}

export const App = (props: IProps) => {
  return (
    <GlobalContextProvider>
      <Router>
        <Routes />
      </Router>
    </GlobalContextProvider>
  );
};
