import { ErrorMessage, Form, Formik, FormikHelpers } from 'formik';
import React from 'react';
import { Alert, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { IMemberLabel } from "../../libs/interfaces/memberLabel.interface";
import { memberLabelService } from '../../services/memberlabel.service';
import { FormGroup } from "../molecules/FormGroup";

interface IFormValue {
  global: string;
  name: string;
}

interface IProps {  
  label?: IMemberLabel;
  organisationID: number;
  onSubmit: ()=>void;
}

export const MemberLabelForm = (props: IProps) => {
  let initialValues: IFormValue = { name: '', global: '' };

  if(props.label) {
    initialValues = { ...initialValues, ...props.label};
  }

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
    if (props.label?.id) {
      await memberLabelService.update(props.label.id, values);
    } else {
      await memberLabelService.add({
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
            <Alert variant="danger">{props.children}</Alert>
          )}
        />

        <FormGroup
          formnikError={errors.name}
          label="Nom du tag"
          name="name"
          type="text"
        />

        <Button variant="primary" type="submit" disabled={isSubmitting}>
          Sauver
        </Button>
        <Link to="/admin/memberlabels">
          <Button variant="secondary">Annuler</Button>
        </Link>
      </Form>
    )}
  </Formik>
);
}