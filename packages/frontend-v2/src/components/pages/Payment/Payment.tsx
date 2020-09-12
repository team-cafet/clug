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
  return (
    <div>
      <h1>Payment page</h1>
      {memberships.map((membership) => (
        <li key={membership.id}>{membership.endDate}</li>
      ))}
      <h2>SALUT</h2>
    </div>
  );
};
