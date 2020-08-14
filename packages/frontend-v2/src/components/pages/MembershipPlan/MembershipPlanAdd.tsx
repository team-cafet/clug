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
  const {id} = useParams();
  
  useEffect( () => {
    const userInfo = getUserInfo();
    console.log(userInfo)
    if (userInfo?.organisation?.id) setOrgID(userInfo?.organisation.id);
    const fetchData = async () => {
      const membershipPlan = await membershipPlanService.getByID(id)
      if(membershipPlan) setPlanToUpdate(membershipPlan.data)
    }
    if(id) fetchData();
  }, [id]);

  
  return (
    <>
  <h1>Ajout d'abonnement</h1>
  <div>{id? planToUpdate? 
  <MembershipPlanForm organisationID={orgID} membershipPlan={planToUpdate} />: null:
  <MembershipPlanForm organisationID={orgID} />}
    
  </div>
  </>
  )
  
};
