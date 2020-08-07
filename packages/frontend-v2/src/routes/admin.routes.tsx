import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { Dashboard } from '../components/pages/Dashboard';

// ------------------------------------------ COMPONENTS IMPORT

export const AdminRoutes = () => (
  <Switch>
    <Route path="/dashboard">
      <Dashboard />
    </Route>

    <Route path="/">
      <h1>Welcome !</h1>
    </Route>
  </Switch>
);
