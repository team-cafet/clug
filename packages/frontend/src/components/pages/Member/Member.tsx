import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useGetAllFromService } from '../../../hooks/useGetAllFromService';
import { IMember } from '../../../libs/interfaces/member.interface';
import { memberService } from '../../../services/member.service';
import { DataTable } from '../../molecules/DataTable';
import './Member.scss';
import { ReactComponent as EditIcon } from '../../../assets/edit.svg';
import '../../organisms/forms.scss';
import { DeleteBtnWithConfirmation } from '../../molecules/Buttons/DeleteBtnWithConfirmation';

export const Member = () => {
  const [members,, setMembers] = useGetAllFromService<IMember>({
    service: memberService,
  });

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
    {
      Header: '',
      accessor: 'id',
      id: 'deleteMember',
      disableFilters: true,
      disableSortBy: true,
      Cell: (cell: any) => (
        <DeleteBtnWithConfirmation
          buttontext=""
          item="ce membre"
          onYes={() => {
            memberService.delete(cell.value);
            let copyData = [...members];
            copyData.splice(cell.index, 1);
            setMembers(copyData);
          }}
        />
      ),
    },
  ];

  const DATA = useMemo(() => {
    return members
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .map((member) => ({
        id: member.id,
        name: `${member.user?.person?.firstname} ${member.user?.person?.lastname}`,
        negativeBalance: member.balance < 0,
      }));
  }, [members]);

  return (
    <>
      <h1>Membres</h1>
      <div className="container">
        <div className="row">
          <Link
            to="/admin/members/add"
            className="btn btn-secondary add"
            title="Ajouter un membre"
          >
            +
          </Link>
        </div>
        <div className="row">
          <DataTable
            data={DATA}
            columns={COLUMNS}
            customRowProps={(row: any) => ({
              className: DATA[row.index]?.negativeBalance
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
      <Button className="editItem">
        <EditIcon title="Modifier" />
      </Button>
    </Link>
  );
};
