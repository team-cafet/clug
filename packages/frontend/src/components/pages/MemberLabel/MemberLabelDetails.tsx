import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUserOrganisation } from '../../../hooks/useUserOrganisation';
import { IMemberLabel } from '../../../libs/interfaces/memberLabel.interface';
import { memberLabelService } from '../../../services/memberlabel.service';
import { MemberLabelForm } from '../../organisms/MemberLabelForm';

interface IProps {}

export const MemberLabelDetails = (props: IProps) => {
  const [orgID] = useUserOrganisation();
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
