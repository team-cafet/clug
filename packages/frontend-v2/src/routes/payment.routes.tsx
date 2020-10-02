import React from 'react';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';
import { Payment } from '../components/pages/Payment/Payment';

export const PaymentRoute = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}`} exact>
        <Payment />
      </Route>

      <Redirect to={`${path}`} />
    </Switch>
  );
};
