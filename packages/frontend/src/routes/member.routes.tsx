import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Member } from '../components/pages/Member/Member';
import { MemberDetails } from '../components/pages/Member/MemberDetails';
import { MemberAdd } from '../components/pages/Member/MemberAdd';


export const MemberRoutes = () => {
  return (
    <Routes>
      <Route path='*' element={<Member />} />
      <Route path='add' element={<MemberAdd />} />
      <Route path=':id' element={<MemberDetails />} />
    </Routes>
  );
};
