import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IClub } from '../../../libs/interfaces/club.interface';
import { clubService } from '../../../services/club.service';
import {ReactComponent as EditIcon} from '../../../assets/edit.svg';

export const Club = () => {
  const [clubs, setClubs] = useState<IClub[]>([]);

  useEffect(() => {
    const getAllClubs = async () => {
      const clubs = await clubService.getAll();
      if (clubs) {
        setClubs(clubs.data);
      }
    };

    getAllClubs();
  }, []);

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
            <tbody>
              {clubs.map((club) => (
                <ClubRow club={club} key={club.id} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const ClubRow = (props: { club: IClub }) => {
  const { club } = props;

  return (
    <tr>
      <td>{club.id}</td>
      <td>{club.name}</td>
      <td>
        <Link to={`/admin/clubs/${club.id}`}>
          <EditIcon title="Modifier ce club"/>
        </Link>
      </td>
    </tr>
  );
};
