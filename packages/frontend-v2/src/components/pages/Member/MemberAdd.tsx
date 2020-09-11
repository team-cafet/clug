import React, { useEffect, useState } from 'react';
import { MemberForm } from '../../organisms/MemberForm';
import { getUserInfo } from '../../../services/auth.service';

interface IProps {}

export const MemberAdd = (props: IProps) => {
  const [orgID, setOrgID] = useState(0);

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo?.organisation?.id) {
      setOrgID(userInfo?.organisation.id);
    }
  }, []);

  return <>
    <MemberForm organisationID={orgID} />
  </>;
};
