import React from 'react';
import { Link } from 'react-router-dom';
import { useGetAllFromService } from '../../../hooks/useGetAllFromService';
import { IMembershipPlan } from '../../../libs/interfaces/membershipPlan.interface';
import { planTypeMapper } from '../../../services/data-mapping.service';
import { membershipService } from '../../../services/membership.service';
import { membershipPlanService } from '../../../services/membership-plan.service';
import { DataTable } from '../../molecules/DataTable';

export const MembershipPlan = () => {
  const [plans, getAllPlans] = useGetAllFromService<IMembershipPlan>({
    service: membershipPlanService,
  });

  const getAllPlans = async (): Promise<void> => {
    const plans = await membershipService.getAll();
      const DATA = plans.map((plan) => ({
    ...plan,
    tacit: plan.tacit ? 'oui' : 'non',
    type: planTypeMapper(plan.type),
  }));


  const COLUMNS = [
    {
      Header: 'Prix',
      accessor: 'price',
    },
    {
      Header: 'Description',
      accessor: 'description',
    },
    {
      Header: 'Type',
      accessor: 'type',
    },
    {
      Header: 'Tacite',
      accessor: 'tacit',
    },
    {
      Header: 'Action',
      accessor: 'id',
      disableFilters: true,
      disableSortBy: true,
      Cell: (cell: any) => (
        <MembershipPlanAction
          plan={cell.row.values}
          refreshList={getAllPlans}
        />
      ),
    },
  ];

  return (
    <>
      <h1>Gestion des abonnements</h1>
      <div className="row">
        <Link to="/admin/membershipPlans/add" className="btn btn-primary">
          Ajouter
        </Link>
        <DataTable data={DATA} columns={COLUMNS} />
      </div>
    </>
  );
};

const MembershipPlanAction = ({ plan, refreshList }: any) => {
  const deletePlan = async (plan: IMembershipPlan) => {
    if (!plan) return;
    const deleteResult = await membershipPlanService.delete(plan.id);
    if (deleteResult) refreshList();
  };

  return (
    <tr>
      <td>{plan.price}</td>
      <td>{planTypeMapper(plan.type)}</td>
      <td>{plan.tacit ? 'oui' : 'non'}</td>
      <td>
        <Link
          to={`/admin/membershipPlans/update/${plan.id}`}
          className="btn btn-primary"
        >
          Modifier
        </Link>
        <button className="btn" onClick={(e) => deletePlan(plan)}>
          Supprimer
        </button>
      </td>
    </tr>
  );
};
