import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { AdminRoutes } from './admin.routes';
import { Login } from '../components/pages/Login';
import { AdminLayout } from '../components/template/AdminLayout';
import { BasicLayout } from '../components/template/BasicLayout';

// ------------------------------------------ COMPONENTS IMPORT

export const Routes = () => (
  <Switch>
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

    <Route path="/">
      <BasicLayout>
        <h1>Welcome !</h1>
      </BasicLayout>
    </Route>
  </Switch>
);
