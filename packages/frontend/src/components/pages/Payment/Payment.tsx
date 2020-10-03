import React, { useEffect, useState } from 'react';
import { IMembership } from '../../../libs/interfaces/membership.interface';
import {} from '../../../services/member.service';
import { membershipService } from '../../../services/membership.service';
import { PaymentCard } from '../../molecules/paymentCard';

export const Payment = () => {
  const [memberships, setMemberships] = useState<IMembership[]>([]);

  const getNotPaidMemberships = async (): Promise<void> => {
    const memberships = await membershipService.getNotPaid();
    setMemberships(memberships?.data);
  };
  useEffect(() => {
    getNotPaidMemberships();
  }, []);
  const paymentReceived = async () => {
    await getNotPaidMemberships();
  };
  return (
    <div>
      <h1>Gestion de paiements</h1>
      {memberships.map((membership) => (
        <PaymentCard
          key={membership.id}
          memberShip={membership}
          onPaymentReceivedFunction={() => {
            paymentReceived();
          }}
        ></PaymentCard>
      ))}
    </div>
  );
};
