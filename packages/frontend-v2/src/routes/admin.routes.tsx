import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { MemberRoutes } from './member.routes';
import { ClubRoutes } from './club.routes';
import { MembershipPlanRoute } from './membershipPlan.routes';
import { MemberLabelRoutes } from './memberLabel.routes';

// ------------------------------------------ COMPONENTS IMPORT
import { Dashboard } from '../components/pages/Dashboard/Dashboard';
import { PaymentRoute } from './payment.routes';

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

      <Route path={`${path}/payments`}>
        <PaymentRoute />
        
      <Route path={`${path}/memberlabels`}>
        <MemberLabelRoutes />
      </Route>

      {/* <Redirect to={`${ADMIN_PREFIX}/`} /> */}
    </Switch>
  );
};
