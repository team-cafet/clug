import React, { useState, useEffect } from 'react';
import { ClubForm } from '../../organisms/ClubForm';
import { getUserInfo } from '../../../services/auth.service';

interface IProps {}

export const ClubAdd = (props: IProps) => {
  const [orgID, setOrgID] = useState(0);

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo?.organisation?.id) {
      setOrgID(userInfo?.organisation.id);
    }
  }, []);

  const onSubmit = ()=>{
    window.history.back();
  }

  return (
    <>
      <ClubForm organisationID={orgID} onSubmit={onSubmit}/>
    </>
  );
};
