import moment, { Moment } from 'moment';
import 'moment/locale/fr';
import React, { useEffect, useState } from 'react';
import { Badge } from 'react-bootstrap';
import { IMembership } from '../../libs/interfaces/membership.interface';
import { IPayment } from '../../libs/interfaces/payment.interface';
import { getPlanTypeName } from '../../services/data-mapping.service';
import { membershipService } from '../../services/membership.service';
import { paymentService } from '../../services/payment.service';
import { paymentRequestService } from '../../services/paymentRequest.service';

interface IProps {
  memberShip: IMembership;
  onPaymentReceivedFunction: CallableFunction;
}

export const PaymentCard = (props: IProps) => {
  const { memberShip, onPaymentReceivedFunction } = props;
  const [alreadyRequested, setAlreadyRequested] = useState<boolean>(false);
  useEffect(() => {
    if (memberShip.paymentRequest) setAlreadyRequested(true);
  }, [memberShip.paymentRequest]);
  const createPaymentRequest = async (
    membership: IMembership
  ): Promise<void> => {
    if (!membership.plan) return; // TODO: how to correctly check non nullity of some fields more globally ?
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
  const createPayment = async (memberShip: IMembership): Promise<void> => {
    if (!memberShip.plan) return;
    let paymentData: IPayment = {
      amount: memberShip.plan.price,
      date: new Date(),
      hasBeenCanceled: false,
    };

    try {
      let newPayment;
      if (alreadyRequested) {
        paymentData.paymentRequest = memberShip.paymentRequest;
        paymentData.member = memberShip.member;
        newPayment = await paymentService.add(paymentData);
      } else {
        newPayment = await paymentService.createPaymentWithoutRequest({
          payment: paymentData,
          membership: memberShip,
        });
      }
      if (newPayment) {
        onPaymentReceivedFunction();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const isExpired = (date: Date): boolean => {
    const dateMoment: Moment = moment(date);
    const todayMoment: Moment = moment();
    return dateMoment.diff(todayMoment) <= 0;
  };

  return (
    <div className="card">
      <div className="card-header">
        {memberShip.member?.user?.person?.firstname} {memberShip.member?.user?.person?.lastname}
      </div>
      <div className="card-body">
        <h5 className="card-title">
          Abonnement {getPlanTypeName(memberShip.plan?.type)},
          {isExpired(memberShip.endDate) ? (
            <Badge variant="danger">échu</Badge>
          ) : (
            ' se termine'
          )}{' '}
          le {/* Am I the best UX designer of the century ? I guess so */}
          {moment(memberShip.endDate).locale('fr').format('LL')}
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
