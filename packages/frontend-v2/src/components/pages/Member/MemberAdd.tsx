import React, { } from 'react';
import { MemberForm } from '../../organisms/MemberForm';
import { useUserOrganisation } from '../../../hooks/userUserOrganisation';

interface IProps {}

export const MemberAdd = (props: IProps) => {
  const [orgID] = useUserOrganisation();

  return <>
    <MemberForm organisationID={orgID} />
  </>;
};
