import React from 'react';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';
import { MemberRoutes } from './member.routes';
import { ClubRoutes } from './club.routes';

// ------------------------------------------ COMPONENTS IMPORT
import { Dashboard } from '../components/pages/Dashboard';
import { MembershipPlan } from '../components/pages/MembershipPlan';

export const AdminRoutes = () => {
  const { path, url } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/`} exact>
        <Dashboard />
      </Route>

      <Route path={`${path}/members`}>
        <MemberRoutes />
      </Route>

      <Route path={`${path}/clubs`}>
        <ClubRoutes />
      </Route>

      <Route path={`${path}/dashboard`}>
        <Dashboard />
      </Route>

      <Route path={`${path}/membershipplan`}>
        <MembershipPlan />
      </Route>

      {/* <Redirect to={`${ADMIN_PREFIX}/`} /> */}
    </Switch>
  );
};
