import React from 'react';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';

// ------------------------------------------ COMPONENTS IMPORT
import { MemberLabel } from '../components/pages/MemberLabel/MemberLabel';
// import { MemberDetails } from '../components/pages/Member/MemberDetails';
// import { MemberAdd } from '../components/pages/Member/MemberAdd';


export const MemberLabelRoutes = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}`} exact>
        <MemberLabel />
      </Route>

      <Route path={`${path}/add`}>
        {/* <MemberAdd /> */}
      </Route>

      <Route path={`${path}/:id`}>
        {/* <MemberDetails /> */}
      </Route>

      <Redirect to={`${path}`} />
    </Switch>
  );
};
