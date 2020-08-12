import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IClub } from '../../../libs/interfaces/club.interface';
import { clubService } from '../../../services/club.service';
import { ClubForm } from '../../organisms/ClubForm';
import { getUserInfo } from '../../../services/auth.service';

interface IProps {}

export const ClubDetails = (props: IProps) => {
  const [orgID, setOrgID] = useState(0);
  let { id } = useParams();
  const [club, setClub] = useState<null | IClub>(null);

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo?.organisation?.id) {
      setOrgID(userInfo?.organisation.id);
    }
  }, []);

  useEffect(() => {
    const getAClub = async () => {
      const result = await clubService.getByID(id);
      if (result?.data) {
        setClub(result.data);
      }
    };

    getAClub();
  }, [id]);

  if (!club) {
    return <>loading...</>;
  }

  return (
    <>
      <ClubForm club={club} organisationID={orgID} />
    </>
  );
};
