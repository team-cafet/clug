import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { Button } from '../atoms/Button';
import { IMembershipPlan } from '../../libs/interfaces/membershipPlan.interface';
import { membershipPlanService } from '../../services/membership-plan.service';
import { getPlanName } from '../../services/data-mapping.service';

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
  const [typeList, setTypeList] = useState<
    any[]
  >([]);
  const [planSelectedId, setPlanSelectedId] = useState('0');
  useEffect(() => {
    const getAllPlans = async () => {
      const membershiPlans = await membershipPlanService.getAllTypes();
      console.log('plans', membershiPlans?.data)
      if (membershiPlans) {
        setTypeList(membershiPlans.data);
      }
    };
    getAllPlans();
    
  }, []);

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

    try {
      if (props.membershipPlan?.id) {
        await membershipPlanService.update(props.membershipPlan.id, values);
      } else {
        values.organisation = { id: props.organisationID };
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
      setSubmitting(false);
    }
  };
  const changePlanSelected = (id: string) => {
    setPlanSelectedId(id);
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
                changePlanSelected(event.target.value);
              }}
            >
              {typeList.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {`${getPlanName(plan.type)}, ${plan.price}.-`}
                </option>
              ))}
            </Field>
            <label htmlFor="tacit">Tacite</label>
            <Field
              className={`form-control ${errors.tacit ? 'is-invalid' : ''}`}
              name="tacit"
            />
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
