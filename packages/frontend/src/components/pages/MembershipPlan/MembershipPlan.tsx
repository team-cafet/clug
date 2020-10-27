import React from 'react';
import { Link } from 'react-router-dom';
import { useGetAllFromService } from '../../../hooks/useGetAllFromService';
import { IMembershipPlan } from '../../../libs/interfaces/membershipPlan.interface';
import { getPlanName } from '../../../services/data-mapping.service';
import { membershipPlanService } from '../../../services/membership-plan.service';
import { DataTable } from '../../molecules/DataTable';
import {ReactComponent as EditIcon} from '../../../assets/edit.svg';
import {ReactComponent as DeleteIcon} from '../../../assets/delete.svg';

export const MembershipPlan = () => {
  const [plans, getAllMembershipPlans] = useGetAllFromService<IMembershipPlan>({
    service: membershipPlanService,
  });

  const DATA = plans.map((plan) => ({
    ...plan,
    tacit: plan.tacit ? 'oui' : 'non',
    type: getPlanName(plan.type),
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
          refreshList={getAllMembershipPlans}
        />
      ),
    },
  ];

  return (
    <>
      <h1>Gestion des abonnements</h1>
      <div className="row">
        <Link to="/admin/membershipPlans/add" className="btn btn-secondary add" title="Ajouter un abonnement">
          +
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
      <td>{getPlanName(plan.type)}</td>
      <td>{plan.tacit ? 'oui' : 'non'}</td>
      <td>
        <Link to={`/admin/membershipPlans/update/${plan.id}`}>
          <EditIcon title="Modifier cet abonnement"/>
        </Link>
      </td>
      <td>
        <button className="btn btn-delete" onClick={(e) => deletePlan(plan)}>
            <DeleteIcon />
        </button>
      </td>
      
    </tr>
  );
};
