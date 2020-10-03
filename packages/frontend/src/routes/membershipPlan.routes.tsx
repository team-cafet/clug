import React from 'react';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';
import { MembershipPlan } from '../components/pages/MembershipPlan/MembershipPlan';
import { MembershipPlanAdd } from '../components/pages/MembershipPlan/MembershipPlanAdd';

export const MembershipPlanRoute = () => {
  const { path } = useRouteMatch();

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
