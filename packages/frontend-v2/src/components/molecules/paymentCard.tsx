import React from 'react';
import { IMembership } from '../../libs/interfaces/membership.interface';
import { planTypeMapper } from '../../services/data-mapping.service';

interface IProps {
  memberShip: IMembership;
}

export const PaymentCard = (props: IProps) => {
  const { memberShip } = props;

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
          <a href="#!" className="btn btn-secondary">
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
