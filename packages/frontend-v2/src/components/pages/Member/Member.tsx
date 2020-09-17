import React, { useEffect, useState } from 'react';
import { memberService } from '../../../services/member.service';
import { IMember } from '../../../libs/interfaces/member.interface';
import { Link } from 'react-router-dom';

import './style.scss';

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

  return (
    <>
      <h1>Membres</h1>
      <div className="container">
        <div className="row">
          <Link to="/admin/members/add" className="btn btn-primary">
            Ajouter
          </Link>
        </div>
        <div className="row">
          <table className="table">
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
          </table>
        </div>
      </div>
    </>
  );
};

const MemberRow = (props: { member: IMember }) => {
  const { member } = props;

  const negativeBalance = member.balance < 0;

  return (
    <tr className={negativeBalance ? 'member-table__row--negative-balance' : ''}>
      <td>
        {member.user?.firstname} {member.user?.lastname}
      </td>
      <td>
        <Link to={`/admin/members/${member.id}`}>...</Link>
      </td>
    </tr>
  );
};
