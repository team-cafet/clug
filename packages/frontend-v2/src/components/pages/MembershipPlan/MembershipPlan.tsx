import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IMembershipPlan, PlanType } from '../../../libs/interfaces/membershipPlan.interface';
import { membershipPlanService } from '../../../services/membershipPlan.service';
import { planTypeMapper } from '../../../services/dataMapping.service';

export const MembershipPlan = () => {
  const [plans, setPlans] = useState<IMembershipPlan[]>([])
  let listOfPlans = [];

  const getAllPlans = async (): Promise<void> =>{
    const plans = await membershipPlanService.getAll();
  
    setPlans(plans?.data);
  }
  useEffect(() => {
    getAllPlans()
  }, []);
  
  return (
    <>
      <h1>Gestion des abonnements</h1>
      <div className="row">
      <Link to="/admin/membershipPlans/add" className="btn btn-primary">
            Ajouter
          </Link>
          <table className="table">
          <tbody>
          <tr>
    <th>prix</th>
    <th>description</th>
    <th>type</th>
    <th>tacite</th>
    <th>action</th>
  </tr>
            
{
plans.map((plan) =><MembershipPlanRow plan={plan} key={plan.id} updateList={getAllPlans}/>)
}
</tbody>
              </table>
              </div>
    </>
  );
};

const MembershipPlanRow = (props: { plan: IMembershipPlan, updateList: CallableFunction }) => {
  const { plan, updateList } = props;
  const deletePlan = async(plan: IMembershipPlan) => {
    if(!plan) return
    const deleteResult = await membershipPlanService.delete(plan.id)
    if(deleteResult) updateList()
  }

  return (
    <tr>
      <td>{plan.price}</td>
      <td>{plan.description}</td>
      <td>{planTypeMapper(plan.type)}</td>
      <td>{plan.tacit? 'oui': 'non'}</td>
      <td><Link to={`/admin/membershipPlans/update/${plan.id}`} className="btn btn-primary">
            Modifier
          </Link>
          <button  className="btn" onClick={(e) => deletePlan(plan)}>Supprimer</button></td>
    </tr>
  );
};