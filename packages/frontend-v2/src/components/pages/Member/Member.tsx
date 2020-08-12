import React, { useEffect, useState } from 'react';
import { memberService } from '../../../services/member.service';
import { IMember } from '../../../libs/interfaces/member.interface';
import { Link } from 'react-router-dom';

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
      <h1>Member</h1>
      <div className="container">
        <div className="row">
          <Link to="/admin/members/add" className="btn btn-primary">
            Ajouter
          </Link>
        </div>
        <div className="row">
          <table className="table">
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

  return (
    <tr>
      <td>{member.id}</td>
      <td>{member.user?.email}</td>
      <td>
        <Link to={`/admin/members/${member.id}`}>...</Link>
      </td>
    </tr>
  );
};
