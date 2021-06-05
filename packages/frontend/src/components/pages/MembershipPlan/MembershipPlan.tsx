import React from 'react';
import { Link } from 'react-router-dom';
import { useGetAllFromService } from '../../../hooks/useGetAllFromService';
import { IMembershipPlan } from '../../../libs/interfaces/membershipPlan.interface';
import { getPlanTypeName } from '../../../services/data-mapping.service';
import { membershipPlanService } from '../../../services/membership-plan.service';
import { DataTable } from '../../molecules/DataTable';
import { ReactComponent as EditIcon } from '../../../assets/edit.svg';
import { DeleteBtnWithConfirmation } from '../../molecules/Buttons/DeleteBtnWithConfirmation';

export const MembershipPlan = () => {
  const [
    plans,,
    setMembershipPlans,
  ] = useGetAllFromService<IMembershipPlan>({
    service: membershipPlanService,
  });

  const DATA = plans
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .map((plan) => ({
      ...plan,
      tacit: plan.tacit ? 'oui' : 'non',
      type: getPlanTypeName(plan.type),
    }));

  const COLUMNS = [
    {
      Header: 'Nom',
      accessor: 'name',
    },
    {
      Header: 'Type',
      accessor: 'type',
      disableFilters: true,
    },
    {
      Header: 'Prix',
      accessor: 'price',
      disableFilters: true,
    },
    {
      Header: 'Edit',
      accessor: 'id',
      disableFilters: true,
      disableSortBy: true,
      Cell: (cell: any) => (
        <Link to={`/admin/membershipPlans/update/${cell.value}`}>
          <EditIcon title="Modifier" />
        </Link>
      ),
    },
    {
      Header: 'Delete',
      accessor: 'id',
      id: 'deleteMembershipPlan',
      disableFilters: true,
      disableSortBy: true,
      Cell: (cell: any) => (
        <DeleteBtnWithConfirmation
          buttontext=""
          item="cet abonnement"
          onYes={() => {
            membershipPlanService.delete(cell.value);
            let copyData = [...plans];
            copyData.splice(cell.index, 1);
            setMembershipPlans(copyData);
          }}
        />
      ),
    },
  ];

  return (
    <>
      <h1>Gestion des abonnements</h1>
      <div className="row">
        <Link
          to="/admin/membershipPlans/add"
          className="btn btn-secondary add"
          title="Ajouter un abonnement"
        >
          +
        </Link>
        <DataTable data={DATA} columns={COLUMNS} />
      </div>
    </>
  );
};
