import React, { useEffect, useState } from 'react';
import { IMember } from '../../../libs/interfaces/member.interface';
import { memberService } from '../../../services/member.service';
import { useParams } from 'react-router-dom';

interface IProps {}

export const MemberDetails = (props: IProps) => {
  let { id } = useParams();
  const [member, setMember] = useState<null | IMember>(null);

  useEffect(() => {
    const getAMember = async () => {
      const result = await memberService.getByID(id);
      if (result?.data) {
        setMember(result.data);
      }
    };

    getAMember();
  }, [id]);

  if (!member) {
    return <>loading...</>;
  }

  return (
    <>
      <h1>{member.user?.email}</h1>
    </>
  );
};
