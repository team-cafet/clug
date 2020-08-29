import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { MemberRoutes } from './member.routes';
import { ClubRoutes } from './club.routes';
import { MembershipPlanRoute } from './membershipPlan.routes';

// ------------------------------------------ COMPONENTS IMPORT
import { Dashboard } from '../components/pages/Dashboard';

export const AdminRoutes = () => {
  const { path } = useRouteMatch();

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

      <Route path={`${path}/membershipPlans`}>
        <MembershipPlanRoute />
      </Route>

      {/* <Redirect to={`${ADMIN_PREFIX}/`} /> */}
    </Switch>
  );
};
