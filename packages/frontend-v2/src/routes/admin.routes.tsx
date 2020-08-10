import React from 'react';
import { Switch, Route } from 'react-router-dom';

// ------------------------------------------ COMPONENTS IMPORT
import { Dashboard } from '../components/pages/Dashboard';
import { Member } from '../components/pages/Member';

const ADMIN_PREFIX = '/admin';

export const AdminRoutes = () => (
  <Switch>
    <Route path={`${ADMIN_PREFIX}/`} exact>
      <Dashboard />
    </Route>

    <Route path={`${ADMIN_PREFIX}/dashboard`}>
      <Dashboard />
    </Route>

    <Route path={`${ADMIN_PREFIX}/members`}>
      <Member />
    </Route>
  </Switch>
);
