import React, { useEffect, useState } from 'react';
import { IMembership } from '../../libs/interfaces/membership.interface';
import { planTypeMapper } from '../../services/data-mapping.service';
import { membershipService } from '../../services/membership.service';
import { paymentRequestService } from '../../services/paymentRequest.service';

interface IProps {
  memberShip: IMembership;
}

export const PaymentCard = (props: IProps) => {
  const { memberShip } = props;
  const [alreadyRequested, setAlreadyRequested] = useState<boolean>(false);
  useEffect(() => {
    if (memberShip.paymentRequest) setAlreadyRequested(true);
  }, [memberShip.paymentRequest]);
  const createPaymentRequest = async (
    membership: IMembership
  ): Promise<void> => {
    if (!membership.plan) return;// TODO: how to correctly check non nullity of some fields more globally ?

    try {
      const newPaymentRequest = await paymentRequestService.add({
        amount: membership.plan.price,
        date: new Date(),
        description: 'demandé manuellement',
      });
      await membershipService.update(membership.id, {
        paymentRequest: newPaymentRequest?.data,
      });
      setAlreadyRequested(true);
    } catch (e) {
      console.error('error on createPaymentRequest()', e);
    }
  };
  const createPayment = async (
    membership: IMembership
  ): Promise<void> => {

  }

  return (
    <div className="card">
      <div className="card-header">
        {memberShip.member?.user?.firstname} {memberShip.member?.user?.lastname}
      </div>
      <div className="card-body">
        <h5 className="card-title">
          Abonnement {planTypeMapper(memberShip.plan?.type)}, échu le{' '}
          {memberShip.endDate}
        </h5>
        prix : {memberShip.plan?.price}.-
        <div className="float-right">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={async () => createPaymentRequest(memberShip)}
            disabled={alreadyRequested}
          >
            Paiment demandé
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={async () => createPayment(memberShip)}
          >
            Argent reçu
          </button>
        </div>
      </div>
    </div>
  );
};
