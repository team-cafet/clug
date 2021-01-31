import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IMemberLabel } from '../../../libs/interfaces/memberLabel.interface';
import { useGetAllFromService } from '../../../hooks/useGetAllFromService';
import { memberLabelService } from '../../../services/memberlabel.service';
import {ReactComponent as EditIcon} from '../../../assets/edit.svg';
import {PopUp} from '../../molecules/PopUp';

export const MemberLabel = () => {
  const [memberLabels, getAllMemberLabels, setMemberLabels] = useGetAllFromService<IMemberLabel>({
    service: memberLabelService,
  });

  useEffect(() => {
    const getAllMemberLabel = async () => {
      const memberLabels = await memberLabelService.getAll();
      if (memberLabels) {
        setMemberLabels(memberLabels.data);
      }
    };

    getAllMemberLabel();
  }, [setMemberLabels]);

  return (
    <>
      <h1>Tag de membre</h1>
      <div className="container">
        <div className="row">
          <Link to="/admin/memberlabels/add" className="btn btn-secondary add" title="Ajouter un tag">
            +
          </Link>
        </div>
        <div className="row">
          <table className="table">
            <tbody>
              {memberLabels.map((label) => (
                <LabelRow label={label} refreshList={getAllMemberLabels} key={label.id} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const LabelRow = ({ label, refreshList }: any) => {
  const deleteLabel = async (club: IMemberLabel) => {
    if (!label) return;
    const deleteResult = await memberLabelService.delete(label.id);
    if (deleteResult) refreshList();
  };
  return (
    <tr>
      <td>{label.id}</td>
      <td>{label.name}</td>
      <td>
        <Link to={`/admin/memberlabels/${label.id}`}>
          <EditIcon title="Modifier"/>
        </Link>
      </td>
      <td>
      <PopUp buttontext="" 
      item="ce tag" 
      onYes={()=>{
        deleteLabel(label);
      }}/>
      </td>
    </tr>
  );
};
