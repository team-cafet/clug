import React, { useState, useEffect } from 'react';
import { MembershipPlanForm } from '../../organisms/MembershipPlanForm';
import { getUserInfo } from '../../../services/auth.service';
import { IMembershipPlan } from '../../../libs/interfaces/membershipPlan.interface';
import { useParams } from 'react-router-dom';
import { membershipPlanService } from '../../../services/membershipPlan.service';

interface IProps {
  membershipPlanId?: number;
}

export const MembershipPlanAdd = (props: IProps) => {
  const [orgID, setOrgID] = useState(0);
  const [planToUpdate, setPlanToUpdate] = useState<IMembershipPlan>();
  const {id} = useParams()

  useEffect( () => {
    const userInfo = getUserInfo();
    if (userInfo?.organisation?.id) setOrgID(userInfo?.organisation.id);
    if(id) fetchData();
  }, []);

  const fetchData = async () => {
    const membershipPlan = await membershipPlanService.getByID(id)
    if(membershipPlan) setPlanToUpdate(membershipPlan.data)
  }
  return (
    <>
  <h1>Ajout d'abonnement</h1>
  <div>
    <MembershipPlanForm organisationID={orgID} membershipPlan={planToUpdate} />
  </div>
  </>
  )
  
};
