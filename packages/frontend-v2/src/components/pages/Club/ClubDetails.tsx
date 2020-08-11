import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IClub } from '../../../libs/interfaces/club.interface';
import { clubService } from '../../../services/club.service';

interface IProps {}

export const ClubDetails = (props: IProps) => {
  let { id } = useParams();
  const [club, setClub] = useState<null | IClub>(null);

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
      <h1>{club.name}</h1>
    </>
  );
};
