import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routing } from '../routes/routes';
import { GlobalContextProvider } from '../contexts/GlobalContext';
import '../index.scss';

interface IProps {}

export const App = (props: IProps) => {
  return (
    <GlobalContextProvider>
      <Router>
        <Routing />
      </Router>
    </GlobalContextProvider>
  );
};
