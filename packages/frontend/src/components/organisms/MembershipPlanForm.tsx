import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { Button } from '../atoms/Button';
import { IMembershipPlan } from '../../libs/interfaces/membershipPlan.interface';
import { membershipPlanService } from '../../services/membership-plan.service';
import { getPlanTypeName } from '../../services/data-mapping.service';

interface IFormValue {
  price?: number;
  name?: string;
  type?: number;
  tacit?: boolean;
  organisation?: {};
}

interface IProps {
  membershipPlan?: IMembershipPlan;
  organisationID: number;
}

export const MembershipPlanForm = (props: IProps) => {
  const initialValues: IFormValue = props.membershipPlan
    ? { ...props.membershipPlan }
    : { price: 0, name: '', type: 1, tacit: false };
  const [typeList, setTypeList] = useState([]);
  const [typeSelectedId, setTypeSelectedId] = useState(0);
  const [tacitSelected, setTacitSelected] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTypes = async () => {
      const types = await membershipPlanService.getAllTypes()
      setTypeList(types?.data)
    }
    fetchTypes();
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
      navigate('/admin/membershipPlans')
    } catch (err: any) {
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
              type="number"
            />
            <label>Nom</label>
            <Field
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              name="name"
            />
            <label htmlFor="type">Type</label>
            <Field
              as="select"
              name="membershipSelect"
              className="form-control"
              onChange={(event: { target: any }) => {
                changeTypeSelected(event.target.value);
              }}
            >
              {typeList.map((type, index) => (
                <option key={index} value={index}>
                  {`${getPlanTypeName(index)}`}
                </option>
              ))}
            </Field>
            <label htmlFor="tacit">Tacite</label>
            <Field
              as="select"
              name="tacitSelect"
              className="form-control"
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
