import React, { useEffect, useState } from 'react';
import { IMembership } from '../../../libs/interfaces/membership.interface';
import {} from '../../../services/member.service';
import { membershipService } from '../../../services/membership.service';

export const Payment = () => {
  const [memberships, setMemberships] = useState<IMembership[]>([]);

  const getNotPaidMemberships = async (): Promise<void> => {
    const memberships = await membershipService.getNotPaid();

    setMemberships(memberships?.data);
  };
  useEffect(() => {
    getNotPaidMemberships();
  }, []);
  return <h1>Payment page</h1>;
};
