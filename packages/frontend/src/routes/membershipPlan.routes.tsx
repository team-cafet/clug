import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MembershipPlan } from '../components/pages/MembershipPlan/MembershipPlan';
import { MembershipPlanAdd } from '../components/pages/MembershipPlan/MembershipPlanAdd';

export const MembershipPlanRoute = () => {
  return (
    <Routes>
      <Route path='*' element={<MembershipPlan />} />
      <Route path='add' element={<MembershipPlanAdd />} />
      <Route path='update/:id' element={<MembershipPlanAdd />} />
    </Routes>
  );
};
