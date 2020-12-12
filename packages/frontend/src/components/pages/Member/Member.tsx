import React, { useMemo } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useGetAllFromService } from '../../../hooks/useGetAllFromService';
import { IMember } from '../../../libs/interfaces/member.interface';
import { memberService } from '../../../services/member.service';
import { DataTable } from '../../molecules/DataTable';
import './Member.scss';
import {ReactComponent as EditIcon} from '../../../assets/edit.svg';
import '../../organisms/forms.scss';


export const Member = () => {
  const [members] = useGetAllFromService<IMember>({service: memberService});

  const COLUMNS: any[] = [
    {
      Header: 'Nom',
      accessor: 'name',
    },
    {
      Header: '',
      accessor: 'id',
      disableFilters: true,
      disableSortBy: true,
      Cell: (cell: any) => <GoToMemberBtn id={cell.value} />,
    },
  ];

  const DATA = useMemo(
    () =>
      members.map((member) => ({
        id: member.id,
        name: `${member.user?.firstname} ${member.user?.lastname}`,
        negativeBalance: member.balance < 0,
      })),
    [members]
  );

  return (
    <>
      <h1>Membres</h1>
      <div className="container">
        <div className="row">
          <Link to="/admin/members/add" className="btn btn-secondary add" title="Ajouter un membre">
          +
          </Link>
        </div>
        <div className="row">
          <DataTable
            data={DATA}
            columns={COLUMNS}
            customRowProps={(row: any) => ({
              className: DATA[row.index].negativeBalance
                ? 'member-table__row--negative-balance'
                : '',
            })}
          />
        </div>
      </div>
    </>
  );
};

const GoToMemberBtn = (props: { id: number }) => {
  return (
    <Link to={`/admin/members/${props.id}`}>
      <EditIcon title="Modifier" />
    </Link>
  );
};
