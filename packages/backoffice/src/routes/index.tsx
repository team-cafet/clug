
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import App from '../pages/App';
import { Login } from '../pages/Login';
import CreateOrganisation from '../pages/organisation/CreateOrganisation';
import Organisations from '../pages/organisation/Organisations';
import Users from '../pages/user/Users';
import useUserStore from '../stores/user';

export const Routing = () => (
  <BrowserRouter>

    <Routes>
      <Route path="/backoffice/login" element={<Login />} />
        
      <Route path="/backoffice" element={
        <RequireAuth>
          <MainLayout></MainLayout>
        </RequireAuth>
        }>
        <Route path="organisations">
          <Route index element={<Organisations />} />
          <Route path="new" element={<CreateOrganisation />} />
        </Route>
        
        <Route path="users">
          <Route index element={<Users />} />
        </Route>
        
        <Route path="*" element={<App />} />

      </Route>

      <Route path="*" element={<h1>404: Nothing to see here</h1>} />
    </Routes>

  </BrowserRouter>
);

const RequireAuth: React.FC<{children: JSX.Element}> = ({ children }) => {
  let user = useUserStore();
  let location = useLocation();

  if (!user.isUserLogged()) {
    return <Navigate to="/backoffice/login" state={{ from: location }} replace />;
  }

  return children;
}
