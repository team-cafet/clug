import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IMembershipPlan } from '../../libs/interfaces/membershipPlan.interface';
import { membershipPlanService } from '../../services/membershipPlan.service';

export const MembershipPlan = () => {
  const [plans, setPlans] = useState<IMembershipPlan[]>([])
  let listOfPlans = [];

  const getAllPlans = async (): Promise<void> =>{
    const plans = await membershipPlanService.getAll();
    setPlans(plans?.data);
  }
  getAllPlans()
  return (
    <>
      <h1>Gestion des abonnements</h1>
      <div className="row">
          <table className="table">
            <tbody>
{
plans.map((plan) =><MembershipPlanRow plan={plan} key={plan.id} />)
}
</tbody>
              </table>
              </div>
    </>
  );
};

const MembershipPlanRow = (props: { plan: IMembershipPlan }) => {
  const { plan } = props;

  return (
    <tr>
      <td>{plan.id}</td>
      <td>{plan.price}</td>
    </tr>
  );
};