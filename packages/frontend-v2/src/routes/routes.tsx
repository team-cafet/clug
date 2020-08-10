import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { AdminRoutes } from './admin.routes';

// ------------------------------------------ COMPONENTS IMPORT
import { AdminLayout } from '../components/template/AdminLayout';
import { BasicLayout } from '../components/template/BasicLayout';
import { Login } from '../components/pages/Login';
import { Home } from '../components/pages/Home';

export const Routes = () => (
  <Switch>
    <Route path="/" exact>
      <BasicLayout>
        <Home />
      </BasicLayout>
    </Route>

    <Route path="/admin">
      <AdminLayout>
        <AdminRoutes />
      </AdminLayout>
    </Route>

    <Route path="/login">
      <BasicLayout>
        <Login />
      </BasicLayout>
    </Route>
  </Switch>
);
