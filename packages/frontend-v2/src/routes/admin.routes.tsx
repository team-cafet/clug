import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { MemberRoutes } from './member.routes';

// ------------------------------------------ COMPONENTS IMPORT
import { Dashboard } from '../components/pages/Dashboard';

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
      <MemberRoutes />
    </Route>

    <Redirect to={`${ADMIN_PREFIX}/`} />
  </Switch>
);
