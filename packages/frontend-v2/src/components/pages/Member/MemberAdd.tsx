import React, { } from 'react';
import { MemberForm } from '../../organisms/MemberForm';
import { useUserOrganisation } from '../../../hooks/useUserOrganisation';

interface IProps {}

export const MemberAdd = (props: IProps) => {
  const [orgID] = useUserOrganisation();

  return <>
    <MemberForm organisationID={orgID} />
  </>;
};
