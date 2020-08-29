import React from 'react';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';

// ------------------------------------------ COMPONENTS IMPORT
import { Member } from '../components/pages/Member/Member';
import { MemberDetails } from '../components/pages/Member/MemberDetails';
import { MemberAdd } from '../components/pages/Member/MemberAdd';


export const MemberRoutes = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}`} exact>
        <Member />
      </Route>

      <Route path={`${path}/add`}>
        <MemberAdd />
      </Route>

      <Route path={`${path}/:id`}>
        <MemberDetails />
      </Route>

      <Redirect to={`${path}`} />
    </Switch>
  );
};
