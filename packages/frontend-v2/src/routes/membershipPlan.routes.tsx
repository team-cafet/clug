import React from 'react';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';
import { MembershipPlan } from '../components/pages/MembershipPlan/MembershipPlan';
import { MembershipPlanAdd } from '../components/pages/MembershipPlan/MembershipPlanAdd';

const PLAN_PREFIX = '/admin/membershipPlan';

export const MembershipPlanRoute = () => {
  const { path, url } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}`} exact>
        <MembershipPlan />
      </Route>

      <Route path={`${path}/add`}>
        <MembershipPlanAdd />
      </Route>

      <Route path={`${path}/update/:id`}>
        <MembershipPlanAdd />
      </Route>

      <Redirect to={`${path}`} />
    </Switch>
  );
};
