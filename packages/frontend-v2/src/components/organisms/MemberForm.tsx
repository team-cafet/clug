import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import { Button } from '../atoms/Button';
import { Alert } from 'react-bootstrap';
import { IMember } from '../../libs/interfaces/member.interface';
import { memberService } from '../../services/member.service';
import { FormGroup } from '../molecules/FormGroup';

interface IFormValue {
  global: string;
  user: {
    email: string;
    firstname: string;
    lastname: string;
    birthdate: Date | string;
    phone: string;
    street: string;
    streetNumber: null | number;
    city: string;
    postalCode: null | number;
  };
}

interface IProps {
  member?: IMember;
  organisationID: number;
}

export const MemberForm = (props: IProps) => {
  const [displayAlertMemberSaved, setDisplayAlertMemberSaved] = useState(false);

  let initialValues: IFormValue = {
    user: {
      email: '',
      firstname: '',
      lastname: '',
      birthdate: '',
      phone: '',
      street: '',
      streetNumber: null,
      city: '',
      postalCode: null,
    },
    global: '',
  };

  if (props.member) {
    initialValues.user = { ...initialValues.user, ...props.member.user };
  }

  const validate = (values: IFormValue) => {
    const errors: any = {};

    if (!values.user.email) {
      errors.user = {};
      errors.user.email = 'Requis';
    }

    return errors;
  };

  const submit = async (
    values: IFormValue,
    formHelper: FormikHelpers<IFormValue>
  ) => {
    const { setSubmitting, setFieldError } = formHelper;

    try {
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
      {({ isSubmitting, errors }) => (
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
