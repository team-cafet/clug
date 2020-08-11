import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

// ------------------------------------------ COMPONENTS IMPORT
import { Club } from '../components/pages/Club/Club';
import { ClubAdd } from '../components/pages/Club/ClubAdd';
import { ClubDetails } from '../components/pages/Club/ClubDetails';

const CLUB_PREFIX = '/admin/clubs';

export const ClubRoutes = () => (
  <Switch>
    <Route path={`${CLUB_PREFIX}/`} exact>
      <Club />
    </Route>

    <Route path={`${CLUB_PREFIX}/add`}>
      <ClubAdd />
    </Route>

    <Route path={`${CLUB_PREFIX}/:id`}>
      <ClubDetails />
    </Route>

    <Redirect to={`${CLUB_PREFIX}/`} />
  </Switch>
);
