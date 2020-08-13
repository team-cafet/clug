import React from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import { Button } from '../atoms/Button';
import { Alert } from '../atoms/Alert';
import { IMembershipPlan } from '../../libs/interfaces/membershipPlan.interface';
import { membershipPlanService } from '../../services/membershipPlan.service';

interface IFormValue {
  global: string;
  name?: string;
}

interface IProps {
  membershipPlan?: IMembershipPlan;
  organisationID: number;
  clubID?: number;
}

export const MembershipPlanForm = (props: IProps) => {
  const initialValues: IFormValue = props.membershipPlan
    ? {
        name: props.membershipPlan.description,
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
      if (props.membershipPlan?.id) {
        await membershipPlanService.update(props.membershipPlan.id, values);
      } else {
        await membershipPlanService.add({
          ...values,
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
            <label>Prix</label>
            <Field
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              name="price"
            />
            <ErrorMessage
              name="price"
              component="div"
              className="invalid-feedback"
            />
          </div>

          <Button variant="primary" type="submit" disabled={isSubmitting}>
            Sauver
          </Button>
          <Link to="/admin/membershipPlans">
            <Button variant="secondary">Annuler</Button>
          </Link>
        </Form>
      )}
    </Formik>
  );
};
