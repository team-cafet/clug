import React, { useState, useEffect } from 'react';
import { ClubForm } from '../../organisms/ClubForm';
import { useUserOrganisation } from '../../../hooks/useUserOrganisation';
import { MemberLabelForm } from '../../organisms/MemberLabelForm';

interface IProps {}

export const MemberLabelAdd = (props: IProps) => {
  const [orgID, setOrgID] = useUserOrganisation();

  const onSubmit = ()=>{
    window.history.back();
  }

  return (
    <>
      <MemberLabelForm organisationID={orgID} onSubmit={onSubmit}/>
    </>
  );
};
