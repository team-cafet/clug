import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { Button } from '../atoms/Button';
import { IMembershipPlan } from '../../libs/interfaces/membershipPlan.interface';
import { membershipPlanService } from '../../services/membership-plan.service';
import { useGetAllFromService } from '../../hooks/useGetAllFromService';

interface IFormValue {
  price?: number;
  description?: string;
  type?: number;
  tacit?: boolean;
  organisation?: {};
}

interface IProps {
  membershipPlan?: IMembershipPlan;
  organisationID: number;
  clubID?: number;
}

export const MembershipPlanForm = (props: IProps) => {
  const initialValues: IFormValue = props.membershipPlan
    ? { ...props.membershipPlan }
    : { price: 0, description: '', type: 1, tacit: false };
  const [typeList, setTypeList] = useGetAllFromService<IMembershipPlan>({
    service: membershipPlanService,
  });
  const [typeSelectedId, setTypeSelectedId] = useState(0);
  const [tacitSelected, setTacitSelected] = useState(false);
  const history = useHistory();

  const validate = (values: IFormValue) => {
    const errors: any = {};
    if (!values.price) errors.price = 'Required';
    return errors;
  };

  const submit = async (
    values: IFormValue,
    formHelper: FormikHelpers<IFormValue>
  ) => {
    const { setSubmitting, setFieldError } = formHelper;
    values.type = typeSelectedId;
    values.tacit = tacitSelected;
    try {
      if (props.membershipPlan?.id) {
        await membershipPlanService.update(props.membershipPlan.id, values);
      } else {
        values.organisation = { id: props.organisationID };
        await membershipPlanService.add({
          ...values,
        });
      }
      history.push('/admin/membershipPlans')
    } catch (err) {
      console.error(err);
      if (err.message) {
        setFieldError('global', err.message);
      } else {
        setFieldError('global', 'Erreur serveur...');
      }
      setSubmitting(false);
    }
    
  };
  const changeTypeSelected = (id: number) => {
    setTypeSelectedId(id);
  };

  const changeTacit = (tacit: string) => {
    setTacitSelected(tacit === 'true');
  };

  return (
    <div id="membershipPlanForm">
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={submit}
      >
        {({ isSubmitting, errors }) => (
          <Form>
            <label htmlFor="price">Prix</label>
            <Field
              className={`form-control ${errors.price ? 'is-invalid' : ''}`}
              name="price"
            />
            <label htmlFor="type">Type</label>
            <Field
              as="select"
              name="membershipSelect"
              onChange={(event: { target: any }) => {
                changeTypeSelected(event.target.value);
              }}
            >
              {typeList.map((type, index) => (
                <option key={index} value={index}>
                  {`${type}`}
                </option>
              ))}
            </Field>
            <label htmlFor="tacit">Tacite</label>
            <Field
              as="select"
              name="tacitSelect"
              onChange={(event: { target: any }) => {
                changeTacit(event.target.value);
              }}
            >
              <option value="true">oui</option>
              <option value="false">non</option>
            </Field>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              Sauver
            </Button>
            <Link to="/admin/membershipPlans">
              <Button variant="secondary">Annuler</Button>
            </Link>
          </Form>
        )}
      </Formik>
    </div>
  );
};
