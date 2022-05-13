import React from 'react';
import { Link } from 'react-router-dom';
import { useGetAllFromService } from '../../../hooks/useGetAllFromService';
import { IMembershipPlan } from '../../../libs/interfaces/membershipPlan.interface';
import { getPlanTypeName } from '../../../services/data-mapping.service';
import { membershipPlanService } from '../../../services/membership-plan.service';
import { DataTable } from '../../molecules/DataTable';
import DeleteBtnWithConfirmation from '../../molecules/Buttons/DeleteBtnWithConfirmation';
import Flex from '../../atoms/Flex';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { AddButton } from '../../molecules/Buttons/AddButton';
import { css } from '@emotion/css';

export const MembershipPlan = () => {
  const [plans, , setMembershipPlans] = useGetAllFromService<IMembershipPlan>({
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
          <FontAwesomeIcon icon={faPen} title={"Modifier l'abonnement"} />
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
          className="warning btn-icon"
        />
      ),
    },
  ];

  return (
    <>
      <Flex justify="space-between">
        <h1>Gestion des abonnements</h1>
        <AddButton
          linkTo="/admin/membershipPlans/add"
          title="Ajouter un abonnement"
        />
      </Flex>

      <div className="row overflow">
        <DataTable
          data={DATA}
          columns={COLUMNS}
          className={css({ td: { verticalAlign: 'middle' } })}
        />
      </div>
    </>
  );
};
