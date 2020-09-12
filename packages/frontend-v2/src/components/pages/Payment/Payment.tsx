import React, { useState } from 'react';
import { IPaymentRequest } from '../../../libs/interfaces/paymentRequest.interface';
const [memberships, setMembership] = useState<IPaymentRequest[]>([]);

export const Payment = () => {
  return <h1>Payment page</h1>;
};
