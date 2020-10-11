import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import React, { useEffect, useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useMemberLabels } from '../../hooks/useMemberLabels';
import { IMember } from '../../libs/interfaces/member.interface';
import { IMembershipPlan } from '../../libs/interfaces/membershipPlan.interface';
import { generatePlanEndDate, getPlanName } from '../../services/data-mapping.service';
import { memberService } from '../../services/member.service';
import { membershipPlanService } from '../../services/membership-plan.service';
import { membershipService } from '../../services/membership.service';
import { FormGroup } from '../molecules/FormGroup';

interface IFormValue {
  global: string;
  memberLabels: number[];
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
  const [membershipPlanList, setMembershipPlanList] = useState<
    IMembershipPlan[]
  >([]);
  const [planSelectedId, setPlanSelectedId] = useState('0');
  const availableMemberLabels = useMemberLabels();
  useEffect(() => {
    const getAllPlans = async () => {
      const membershiPlans = await membershipPlanService.getAll();
      if (membershiPlans) {
        setMembershipPlanList(membershiPlans.data);
      }
    };

    getAllPlans();
  }, []);
  let initialValues: IFormValue = {
    memberLabels: [],
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
    initialValues.memberLabels =
      props.member.memberLabels?.map((label) => label.id) || [];
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
        const planSelected = membershipPlanList.find(
          (plan) => plan.id === parseInt(planSelectedId)
        );/* 
        const newMember = await memberService.add({
          ...values,
          organisation: { id: props.organisationID },
        });
        if(newMember)
          await membershipService.add({
            startDate: new Date(),
            endDate: new Date + 
          })   */
          console.log(generatePlanEndDate(new Date(), planSelected?.type))
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

  //TODO: why it doesn't work to call setPlanSelected directly in the jsx ?
  const changePlanSelected = (id: string) => {
    setPlanSelectedId(id);
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
            <h2>Abonnement</h2>
            <div className="form-row">
              <Field
                as="select"
                name="membershipSelect"
                onChange={(event: { target: any }) => {
                  changePlanSelected(event.target.value);
                }}
              >
                <option value="0">aucun</option>
                {membershipPlanList.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {`${getPlanName(plan.type)}, ${plan.price}.-`}
                  </option>
                ))}
              </Field>
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
