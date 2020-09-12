import React from 'react';
import { IMembership } from '../../libs/interfaces/membership.interface';

interface IProps {
  memberShip: IMembership;
}

export const PaymentCard = (props: IProps) => {
  const { memberShip } = props;

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">
          {memberShip.member?.user?.firstname}{' '}
          {memberShip.member?.user?.lastname}
        </h5>
      </div>
    </div>
  );
};
