import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Payment } from '../components/pages/Payment/Payment';

export const PaymentRoute = () => {
  return (
    <Routes>
      <Route path='*' element={<Payment />} />
    </Routes>
  );
};
