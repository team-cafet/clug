import React from 'react';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';

// ------------------------------------------ COMPONENTS IMPORT
import { MemberLabel } from '../components/pages/MemberLabel/MemberLabel';
import { MemberLabelAdd } from '../components/pages/MemberLabel/MemberLabelAdd';
import { MemberLabelDetails } from '../components/pages/MemberLabel/MemberLabelDetails';
// import { MemberDetails } from '../components/pages/Member/MemberDetails';



export const MemberLabelRoutes = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}`} exact>
        <MemberLabel />
      </Route>

      <Route path={`${path}/add`}>
        <MemberLabelAdd />
      </Route>

      <Route path={`${path}/:id`}>
        <MemberLabelDetails />
      </Route>

      <Redirect to={`${path}`} />
    </Switch>
  );
};
