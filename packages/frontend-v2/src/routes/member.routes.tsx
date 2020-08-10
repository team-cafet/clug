import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

// ------------------------------------------ COMPONENTS IMPORT
import { Member } from '../components/pages/Member/Member';
import { MemberDetails } from '../components/pages/Member/MemberDetails';
import { MemberAdd } from '../components/pages/Member/MemberAdd';

const MEMBER_PREFIX = '/admin/members';

export const MemberRoutes = () => (
  <Switch>
    <Route path={`${MEMBER_PREFIX}/`} exact>
      <Member />
    </Route>

    <Route path={`${MEMBER_PREFIX}/add`}>
      <MemberAdd />
    </Route>

    <Route path={`${MEMBER_PREFIX}/:id`}>
      <MemberDetails />
    </Route>

    <Redirect to={`${MEMBER_PREFIX}/`} />
  </Switch>
);
