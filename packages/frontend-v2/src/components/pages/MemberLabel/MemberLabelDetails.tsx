import React, { useState, useEffect } from 'react';
import { ClubForm } from '../../organisms/ClubForm';
import { useUserOrganisation } from '../../../hooks/useUserOrganisation';
import { MemberLabelForm } from '../../organisms/MemberLabelForm';
import { IMemberLabel } from '../../../libs/interfaces/memberLabel.interface';
import { useParams } from 'react-router-dom';
import { memberLabelService } from '../../../services/memberlabel.service';

interface IProps {}

export const MemberLabelDetails = (props: IProps) => {
  const [orgID, setOrgID] = useUserOrganisation();
  let { id } = useParams();
  const [label, setLabel] = useState<null | IMemberLabel>(null);

  useEffect(() => {
    const getAClub = async () => {
      const result = await memberLabelService.getByID(id);
      if (result?.data) {
        setLabel(result.data);
      }
    };

    getAClub();
  }, [id]);

  const onSubmit = ()=>{
    window.history.back();
  }

  if(!label){
    return <>loading....</>;
  }

  return (
    <>
      <MemberLabelForm label={label} organisationID={orgID} onSubmit={onSubmit}/>
    </>
  );
};
