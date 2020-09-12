import React from 'react';
import { IMembership } from '../../libs/interfaces/membership.interface';
import { planTypeMapper } from '../../services/data-mapping.service';
import { paymentRequestService } from '../../services/paymentRequest.service';

interface IProps {
  memberShip: IMembership;
}
// TODO: how to correctly check non nullity of some fields ?
export const PaymentCard = (props: IProps) => {
  const { memberShip } = props;
  const createPaymentRequest = async (
    amount: number | undefined
  ): Promise<void> => {
    if (!amount) return;

    try {
      await paymentRequestService.add({
        amount: amount,
        date: new Date(),
        description: 'demandé manuellement',
      });
    } catch (e) {
      console.error('error on createPaymentRequest()', e);
    }
  };

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
          <a
            href="#!"
            className="btn btn-secondary"
            onClick={async () => createPaymentRequest(memberShip.plan?.price)}
          >
            Paiment demandé
          </a>
          <a href="#!" className="btn btn-primary">
            Paiment reçu
          </a>
        </div>
      </div>
    </div>
  );
};
