import React from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import { Button } from '../atoms/Button';
import { clubService } from '../../services/club.service';
import { IClub } from '../../libs/interfaces/club.interface';
import { NotificationFailed } from '../molecules/Notifications/NotificationFailed';

interface IFormValue {
  global: string;
  name: string;
}

interface IProps {
  club?: IClub;
  organisationID: number;
  onSubmit: ()=>void;
}

export const ClubForm = (props: IProps) => {
  const initialValues: IFormValue = props.club
    ? {
        name: props.club.name,
        global: '',
      }
    : { name: '', global: '' };

  const validate = (values: IFormValue) => {
    const errors: any = {};

    if (!values.name) {
      errors.name = 'Required';
    }

    return errors;
  };

  const submit = async (
    values: IFormValue,
    formHelper: FormikHelpers<IFormValue>
  ) => {
    const { setSubmitting, setFieldError } = formHelper;

    try {
      if (props.club?.id) {
        await clubService.update(props.club.id, values);
      } else {
        await clubService.add({
          ...values,
          organisation: { id: props.organisationID },
        });
      }

      props.onSubmit();
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
          <ErrorMessage
            name="global"
            component={(props) => (
              <NotificationFailed>{props.children}</NotificationFailed>
            )}
          />

          <div className={`form-group`}>
            <label>Nom</label>
            <Field
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              name="name"
            />
            <ErrorMessage
              name="name"
              component="div"
              className="invalid-feedback"
            />
          </div>

          <Button variant="primary" type="submit" disabled={isSubmitting}>
            Sauver
          </Button>
          <Link to="/admin/clubs">
            <Button variant="secondary">Annuler</Button>
          </Link>
        </Form>
      )}
    </Formik>
  );
};
