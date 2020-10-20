import React from 'react';
import { useUserOrganisation } from '../../../hooks/useUserOrganisation';
import { MemberLabelForm } from '../../organisms/MemberLabelForm';

interface IProps {}

export const MemberLabelAdd = (props: IProps) => {
  const [orgID] = useUserOrganisation();

  const onSubmit = ()=>{
    window.history.back();
  }

  return (
    <>
      <MemberLabelForm organisationID={orgID} onSubmit={onSubmit}/>
    </>
  );
};
