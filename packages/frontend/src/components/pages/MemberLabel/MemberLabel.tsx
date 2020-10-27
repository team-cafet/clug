import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IMemberLabel } from '../../../libs/interfaces/memberLabel.interface';
import { memberLabelService } from '../../../services/memberlabel.service';
import {ReactComponent as EditIcon} from '../../../assets/edit.svg';

export const MemberLabel = () => {
  const [memberLabels, setMemberLabels] = useState<IMemberLabel[]>([]);

  useEffect(() => {
    const getAllMemberLabel = async () => {
      const memberLabels = await memberLabelService.getAll();
      if (memberLabels) {
        setMemberLabels(memberLabels.data);
      }
    };

    getAllMemberLabel();
  }, []);

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
                <LabelRow label={label} key={label.id} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const LabelRow = (props: { label: IMemberLabel }) => {
  const { label } = props;

  return (
    <tr>
      <td>{label.id}</td>
      <td>{label.name}</td>
      <td>
        <Link to={`/admin/memberlabels/${label.id}`}>
          <EditIcon title="Modifier ce label"/>
        </Link>
      </td>
    </tr>
  );
};
