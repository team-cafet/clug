import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import React, { useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useGetAllFromService } from '../../hooks/useGetAllFromService';
import { IClub } from '../../libs/interfaces/club.interface';
import { IMember } from '../../libs/interfaces/member.interface';
import { IMemberLabel } from '../../libs/interfaces/memberLabel.interface';
import { clubService } from '../../services/club.service';
import { memberService } from '../../services/member.service';
import { memberLabelService } from '../../services/memberlabel.service';
import { FormGroup } from '../molecules/FormGroup';

interface IFormValue {
  global: string;
  memberLabels: number[];
  club: undefined | number;
  user: {
    email: string;
    firstname: string;
    lastname: string;
    birthdate: Date | string;
    phone: string;
    street: string;
    streetNumber: undefined | number;
    city: string;
    postalCode: undefined | number;
  };
}

interface IProps {
  member?: IMember;
  organisationID: number;
}

export const MemberForm = (props: IProps) => {
  const [displayAlertMemberSaved, setDisplayAlertMemberSaved] = useState(false);
  const [availableMemberLabels] = useGetAllFromService<IMemberLabel>({
    service: memberLabelService,
  });
  const [avaiableClubs] = useGetAllFromService<IClub>({
    service: clubService,
  });

  let initialValues: IFormValue = {
    memberLabels: [],
    club: undefined,
    user: {
      email: '',
      firstname: '',
      lastname: '',
      birthdate: '',
      phone: '',
      street: '',
      streetNumber: undefined,
      city: '',
      postalCode: undefined,
    },
    global: '',
  };

  if (props.member) {
    initialValues.memberLabels =
      props.member.memberLabels?.map((label) => label.id) || [];
    initialValues.club = props.member.club?.id;
    initialValues.user = { ...initialValues.user, ...props.member.user };
    console.log(initialValues);
  }

  const validate = (values: IFormValue) => {
    const errors: any = {};

    if (!values.user.email) {
      errors.user = { ...errors.user };
      errors.user.email = 'Requis';
    }

    if (!values.user.birthdate) {
      errors.user = { ...errors.user };
      errors.user.birthdate = 'Requis';
    }

    return errors;
  };

  const submit = async (
    values: IFormValue,
    formHelper: FormikHelpers<IFormValue>
  ) => {
    const { setSubmitting, setFieldError } = formHelper;

    try {
      (values as any) = {
        ...values,
        // tag send to the server must be at least have id and name
        memberLabels: values.memberLabels.map((label: any) =>
          availableMemberLabels.find(
            (availabelLabel) => availabelLabel.id === Number.parseInt(label)
          )
        ),
      };
      if (props.member?.id) {
        await memberService.update(props.member.id, values);
      } else {
        await memberService.add({
          ...values,
          organisation: { id: props.organisationID },
        });
      }
      setDisplayAlertMemberSaved(true);
    } catch (err) {
      console.error(err);
      if (err.message) {
        setFieldError('global', err.message);
      } else {
        setFieldError('global', 'Erreur serveur...');
      }
    }

    setSubmitting(false);
  };

  return (
    <Formik initialValues={initialValues} validate={validate} onSubmit={submit}>
      {({ isSubmitting, errors, setFieldValue, values }) => (
        <Form>
          {displayAlertMemberSaved && (
            <Alert
              variant="success"
              onClose={() => setDisplayAlertMemberSaved(false)}
              dismissible
            >
              Le membre a bien été sauvé !
            </Alert>
          )}

          <ErrorMessage
            name="global"
            component={(props) => (
              <Alert variant="danger">{props.children}</Alert>
            )}
          />

          {/* General member information */}
          <div>
            <h2>Tag</h2>
            <Field
              component="select"
              multiple={true}
              name="memberLabels"
              className="form-control"
            >
              {availableMemberLabels.map((label) => (
                <option key={label.id} value={label.id}>
                  {label.name}
                </option>
              ))}
            </Field>

            <h2>Club</h2>
            <Field
              component="select"
              multiple={false}
              name="club"
              className="form-control"
            >
              {avaiableClubs.map((club) => (
                <option key={club.id} value={club.id}>
                  {club.name}
                </option>
              ))}
            </Field>

            <h2>Informations générales</h2>

            <FormGroup
              label="Email"
              type="text"
              formnikError={errors.user?.email}
              name="user.email"
            />

            <FormGroup
              label="Nom"
              type="text"
              formnikError={errors.user?.lastname}
              name="user.lastname"
            />
            <FormGroup
              label="Prénom"
              type="text"
              formnikError={errors.user?.firstname}
              name="user.firstname"
            />

            <FormGroup
              label="Date de naissance"
              type="date"
              formnikError={errors.user?.birthdate}
              name="user.birthdate"
            />

            <FormGroup
              label="Téléphone"
              type="text"
              formnikError={errors.user?.phone}
              name="user.phone"
            />

            <h2>Adresse</h2>

            <div className="form-row">
              <FormGroup
                className="col-8"
                label="Rue"
                type="text"
                formnikError={errors.user?.street}
                name="user.street"
              />
              <FormGroup
                className="col"
                label="Numéro"
                type="number"
                formnikError={errors.user?.streetNumber}
                name="user.streetNumber"
              />
            </div>

            <div className="form-row">
              <FormGroup
                className="col-4"
                label="NPA"
                type="number"
                formnikError={errors.user?.postalCode}
                name="user.postalCode"
              />
              <FormGroup
                className="col"
                label="Ville"
                type="text"
                formnikError={errors.user?.city}
                name="user.city"
              />
            </div>
          </div>

          <Button variant="primary" type="submit" disabled={isSubmitting}>
            Sauver
          </Button>
          <Link to="/admin/members">
            <Button variant="secondary">Annuler</Button>
          </Link>
        </Form>
      )}
    </Formik>
  );
};
