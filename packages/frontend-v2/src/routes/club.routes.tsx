import React from 'react';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';

// ------------------------------------------ COMPONENTS IMPORT
import { Club } from '../components/pages/Club/Club';
import { ClubAdd } from '../components/pages/Club/ClubAdd';
import { ClubDetails } from '../components/pages/Club/ClubDetails';

export const ClubRoutes = () => {
  const { path, url } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}`} exact>
        <Club />
      </Route>

      <Route path={`${path}/add`}>
        <ClubAdd />
      </Route>

      <Route path={`${path}/:id`}>
        <ClubDetails />
      </Route>

      <Redirect to={`${path}`} />
    </Switch>
  );
};
