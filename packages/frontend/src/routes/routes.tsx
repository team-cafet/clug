import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminRoutes } from './admin.routes';
import { AdminLayout } from '../components/template/AdminLayout';
import { BasicLayout } from '../components/template/BasicLayout';
import { Login } from '../components/pages/Login';
import { Home } from '../components/pages/Home';
import { Logout } from '../components/pages/Logout';

export const Routing = () => (
  <Routes>
    <Route path="/" element={<BasicLayout><Home /></BasicLayout>} />
    <Route path="/login" element={<BasicLayout><Login /></BasicLayout>} />
    <Route path="/logout" element={<BasicLayout><Logout /></BasicLayout>} />
    <Route path="*" element={<BasicLayout><h1>404: Nothing to see here</h1></BasicLayout>} />
    
    <Route path="/admin/*" element={<AdminLayout><AdminRoutes /></AdminLayout>} />
  </Routes>
);
