import React, { useEffect, useState, useMemo } from 'react';
import { memberService } from '../../../services/member.service';
import { IMember } from '../../../libs/interfaces/member.interface';
import { Link } from 'react-router-dom';

import './style.scss';
import { DataTable } from '../../molecules/DataTable/DataTable';
import { Column, UseFiltersColumnProps, UseFiltersColumnOptions } from 'react-table';
import { BasicFilter } from '../../molecules/DataTable/BasicFilter';

export const Member = () => {
  const [members, setMembers] = useState<IMember[]>([]);

  useEffect(() => {
    const getAllMembers = async () => {
      const members = await memberService.getAll();
      if (members) {
        setMembers(members.data);
      }
    };

    getAllMembers();
  }, []);

  const COLUMNS: any[] = [
    {
      Header: 'Nom',
      accessor: 'name'
    },
    {
      Header: '',
      accessor: 'id',
      disableFilters: true,
      disableSortBy: true,
      Cell: (cell: any)=><GoToMemberBtn id={cell.value}/>
    }
  ];

  const DATA = useMemo(
    () =>
      members.map((member) => ({
        id: member.id,
        name: `${member.user?.firstname} ${member.user?.lastname}`,
      })),
    [members]
  );

  return (
    <>
      <h1>Member</h1>
      <div className="container">
        <div className="row">
          <Link to="/admin/members/add" className="btn btn-primary">
            Ajouter
          </Link>
        </div>
        <div className="row">
          <DataTable data={DATA} columns={COLUMNS} />
          {/* <table className="table">
            <thead>
              <tr>
                <th>
                  Nom
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <MemberRow member={member} key={member.id} />
              ))}
            </tbody>
          </table> */}
        </div>
      </div>
    </>
  );
};

const GoToMemberBtn = (props: { id: number }) => {
  return <Link to={`/admin/members/${props.id}`}>...</Link>;
};

const MemberRow = (props: { member: IMember }) => {
  const { member } = props;

  const negativeBalance = member.balance < 0;

  return (
    <tr
      className={negativeBalance ? 'member-table__row--negative-balance' : ''}
    >
      <td>
        {member.user?.firstname} {member.user?.lastname}
      </td>
      <td>
        <Link to={`/admin/members/${member.id}`}>...</Link>
      </td>
    </tr>
  );
};
