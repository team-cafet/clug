import React, { useState, useEffect } from 'react';
import { MembershipPlanForm } from '../../organisms/MembershipPlanForm';
import { getUserInfo } from '../../../services/auth.service';

interface IProps {}

export const MembershipPlanAdd = (props: IProps) => {
  const [orgID, setOrgID] = useState(0);

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo?.organisation?.id) setOrgID(userInfo?.organisation.id);
  }, []);

  return (
    <>
  <h1>Ajout d'abonnement</h1>
  <div>
    <MembershipPlanForm organisationID={orgID} />
  </div>
  </>
  )
  
};
