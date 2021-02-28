import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IClub } from '../../../libs/interfaces/club.interface';
import { useGetAllFromService } from '../../../hooks/useGetAllFromService';
import { clubService } from '../../../services/club.service';
import {ReactComponent as EditIcon} from '../../../assets/edit.svg';
import {DeleteBtnWithConfirmation} from '../../molecules/Buttons/DeleteBtnWithConfirmation';

export const Club = () => {
  const [clubs, getAllClubs, setClubs] = useGetAllFromService<IClub>({
    service: clubService,
  });

  useEffect(() => {
    const getAllClubs = async () => {
      const clubs = await clubService.getAll();
      if (clubs) {
        setClubs(clubs.data);
      }
    };

    getAllClubs();
  }, [setClubs]);

  return (
    <>
      <h1>Clubs</h1>
      <div className="container">
        <div className="row">
          <Link to="/admin/clubs/add" className="btn btn-secondary add" title="Ajouter un club">
            +
          </Link>
        </div>
        <div className="row">
          <table className="table">
            <thead>
              <tr>
                <th>N°</th>
                <th>Nom</th>
                <th>Description</th>  
              </tr>
            </thead>
            <tbody>
              {clubs
              .sort((a, b) =>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() )
              .map((club) => (
                  <ClubRow club={club} refreshList={getAllClubs} key={club.id}/>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const ClubRow = ({ club, refreshList }: any) => {
  const deleteClub = async (club: IClub) => {
    if (!club) return;
    const deleteResult = await clubService.delete(club.id);
    if (deleteResult) refreshList();
  };

  return (
    <tr>
      <td>{club.id}</td>
      <td>{club.name}</td>
      <td>{club.description}</td>
      <td>
        <Link to={`/admin/clubs/${club.id}`}>
          <EditIcon title="Modifier"/>
        </Link>
      </td>
      <td>
      <DeleteBtnWithConfirmation buttontext="" 
      item="ce club" 
      onYes={()=>{
        deleteClub(club);
      }}/>
      </td>
    </tr>
  );
};
