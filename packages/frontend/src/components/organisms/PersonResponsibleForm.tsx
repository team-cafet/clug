import React from 'react';
import { FormGroup } from '../molecules/FormGroup';

interface IProps {
  firstName?: string;
  lastName?: string;
  phone?: boolean;
}

export const PersonResponsibleForm = (props: IProps) => {
  const { firstName, lastName, phone } = props;

  return (
    <div className='form-responsibleContact'>
      <p>Veuillez rentrer les informations concernant la personne responsable du membre:</p>
      <div className="form-row">
        <FormGroup
          label="Nom"
          type="text"
          formnikError={undefined}
          name="user.person.lastname"
          className="col-3"
        />
        <FormGroup
          label="Prénom"
          type="text"
          formnikError={undefined}
          name="user.person.firstname"
          className="col-3"
        />

        <FormGroup
          label="Téléphone"
          type="text"
          formnikError={undefined}
          name="user.person.phone"
          className="col-6"
        />
      </div>
    </div>
  );
};
