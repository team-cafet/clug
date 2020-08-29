import React from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import { Button } from '../atoms/Button';
import { Alert } from '../atoms/Alert';
import { IMember } from '../../libs/interfaces/member.interface';
import { memberService } from '../../services/member.service';

interface IFormValue {
  global: string;
  user: {
    email: string;
    firstname: string;
    lastname: string;
  };
}

interface IProps {
  member?: IMember;
  organisationID: number;
}

export const MemberForm = (props: IProps) => {
  const initialValues: IFormValue = props.member
    ? {
        user: {
          email: '',
          firstname: '',
          lastname: '',
          ...props.member.user,
        },
        global: '',
      }
    : {
        user: {
          email: '',
          firstname: '',
          lastname: '',
        },
        global: '',
      };

  const validate = (values: IFormValue) => {
    const errors: any = {user:{}};

    if (!values.user.email) {
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
              <Alert variant="danger">{props.children}</Alert>
            )}
          />

          <div className={`form-group`}>
            <label>Email</label>
            <Field
              className={`form-control ${
                errors.user?.email ? 'is-invalid' : ''
              }`}
              name="user.email"
            />
            <ErrorMessage
              name="user.email"
              component="div"
              className="invalid-feedback"
            />
          </div>

          <div className={`form-group`}>
            <label>Nom</label>
            <Field
              className={`form-control ${
                errors.user?.lastname ? 'is-invalid' : ''
              }`}
              name="user.lastname"
            />
            <ErrorMessage
              name="user.lastname"
              component="div"
              className="invalid-feedback"
            />
          </div>

          <div className={`form-group`}>
            <label>Prénom</label>
            <Field
              className={`form-control ${
                errors.user?.firstname ? 'is-invalid' : ''
              }`}
              name="user.firstname"
            />
            <ErrorMessage
              name="user.firstname"
              component="div"
              className="invalid-feedback"
            />
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
