import React, { useEffect, useState } from 'react';
import { memberService } from '../../services/member.service';
import { IMember } from '../../libs/interfaces/member.interface';

export const Member = () => {
  const [members, setMembers] = useState<IMember[]>([]);

  useEffect(() => {
    const getAllMembers = async () => {
      const members = await memberService.getAll();
      if (members) {
        console.log(members.data);
        setMembers(members.data);
      }
    };

    getAllMembers();
  }, []);
  return (
    <>
      <h1>Member</h1>
      <div>
        {members.map((member) => (
          <div key={member.id}>
            <div>{member.id}</div>
            <div>{member.user?.email}</div>
          </div>
        ))}
      </div>
    </>
  );
};
