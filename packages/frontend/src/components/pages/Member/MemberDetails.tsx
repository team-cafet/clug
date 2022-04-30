import React, { useEffect, useState } from 'react';
import { IMember } from '../../../libs/interfaces/member.interface';
import { memberService } from '../../../services/member.service';
import { useParams } from 'react-router-dom';
import { MemberForm } from '../../organisms/MemberForm';
import { useUserOrganisation } from '../../../hooks/useUserOrganisation';

interface IProps {}

export const MemberDetails = (props: IProps) => {
  let { id } = useParams();
  const [member, setMember] = useState<null | IMember>(null);
  const [orgID] = useUserOrganisation();

  useEffect(() => {
    const getAMember = async () => {
      const result = await memberService.getByID(id as string);
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
      <MemberForm organisationID={orgID} member={member} />
    </>
  );
};
