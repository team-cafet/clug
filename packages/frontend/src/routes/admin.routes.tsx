import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MemberRoutes } from './member.routes';
import { MembershipPlanRoute } from './membershipPlan.routes';
import { Dashboard } from '../components/pages/Dashboard/Dashboard';
import { PaymentRoute } from './payment.routes';

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route path={`dashboard`} element={<Dashboard />} />
      <Route path={`members/*`} element={<MemberRoutes />} />
      <Route path={`membershipPlans/*`} element={<MembershipPlanRoute />} />
      <Route path={`payments/*`} element={<PaymentRoute />} />
    </Routes>
  );
};
