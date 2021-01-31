import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import React, { useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
//@ts-ignore
import Select from 'react-select';
import { Link, useHistory } from 'react-router-dom';
import { useGetAllFromService } from '../../hooks/useGetAllFromService';
import { IClub } from '../../libs/interfaces/club.interface';
import { IMember } from '../../libs/interfaces/member.interface';
import { IMemberLabel } from '../../libs/interfaces/memberLabel.interface';
import { IMembershipPlan } from '../../libs/interfaces/membershipPlan.interface';
import { clubService } from '../../services/club.service';
import { memberService } from '../../services/member.service';
import { memberLabelService } from '../../services/memberlabel.service';
import { membershipPlanService } from '../../services/membership-plan.service';
import { FormGroup } from '../molecules/FormGroup';
import moment from 'moment';
import { ReactComponent as DeleteIcon } from '../../assets/delete.svg';
import {
  generatePlanEndDate,
  getPlanName,
} from '../../services/data-mapping.service';
import { membershipService } from '../../services/membership.service';
import { IMembership } from '../../libs/interfaces/membership.interface';
import { DeleteBtnWithConfirmation } from '../molecules/Buttons/DeleteBtnWithConfirmation';

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
  memberships: IMembership[];
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

  const [membershipPlanList] = useGetAllFromService<IMembershipPlan>({
    service: membershipPlanService,
  });
  const [selectedMembershipPlanID, setSelectedMembershipPlanID] = useState('1');
  const [membershipStartDate, setMembershipStartDate] = useState(
    moment(
      props?.member?.memberships && props?.member?.memberships[0]
        ? props?.member?.memberships[0].startDate
        : undefined
    ).format('YYYY-MM-DD')
  );

  const history = useHistory();

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
    memberships: [],
  };

  if (props.member && props.member.memberships) {
    initialValues.memberLabels =
      props.member.memberLabels?.map((label) => label.id) || [];
    initialValues.club = props.member.club?.id;
    initialValues.user = { ...initialValues.user, ...props.member.user };
    initialValues.memberships = props.member.memberships;
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

  /**
   * Cancel the current membership of the member by making an
   * API call
   */
  const terminateMembership = async () => {
    if (!props.member?.id) return;
    if(!props.member.memberships || !props.member.memberships[0]) return;

    const idMembership = props.member.memberships[0].id;

    const result = await membershipService.delete(idMembership);

    if (!result?.status || result?.status !== 200) {
      console.error(result);
    }

    window.location.reload();
  };

  /**
   * Confirmation before deletion
   */
  const deleteMember = async () => {
    if (!props.member?.id) return;

    await memberService.delete(props.member.id);
    history.push('/admin/members');
  };

  /**
   *
   * @param values
   * @param formHelper
   */
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

      if(!isMembershipSet()){
        await membershipService.add({
          member: props.member,
          startDate: membershipStartDate,
          plan : selectedMembershipPlanID
        })
      }

      const planSelected = membershipPlanList.find(
        (plan) => plan.id === parseInt(selectedMembershipPlanID)
      );

      if (props.member?.id) {
        await memberService.update(props.member.id, values);
        window.location.reload();

      } else {
        const result = await memberService.add({
          ...values,
          organisation: { id: props.organisationID },
          memberships: planSelected
            ? [
                {
                  startDate: new Date(membershipStartDate),
                  endDate: generatePlanEndDate(
                    new Date(membershipStartDate),
                    planSelected?.type
                  ),
                  plan: planSelected,
                },
              ]
            : [],
        });

        backToMemberPage();
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

  /**
   *
   */
  const backToMemberPage = () => {
    history.push('/admin/members');
  };

  /**
   *
   * @param id
   */
  const changeMembershipPlan = (id: string) => {
    setSelectedMembershipPlanID(id);
  };

  /**
   * Control if the member has a membership set
   */
  const isMembershipSet = () => {
    if (!props.member?.id) return false;

    if (!props.member?.memberships || props.member?.memberships.length <= 0)
      return false;

    return true;
  };

  return (
    <Formik initialValues={initialValues} validate={validate} onSubmit={submit}>
      {({ isSubmitting, errors, setFieldValue, values }) => (
        <Form className="form">
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
          <div className="memberForm">
            <h1>
              {props.member
                ? 'Modifier le profil de ' + props.member.user?.firstname
                : 'Créer un membre'}
            </h1>
            <label htmlFor="memberLabels">Tag</label>
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
            <label htmlFor="club">Club</label>
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

            <h2>Abonnement</h2>
            <div className="form-row">
              <label htmlFor="membershipSelect">type</label>
              <Field
                as="select"
                name="membershipSelect"
                onChange={(event: { target: any }) => {
                  changeMembershipPlan(event.target.value);
                }}
                className="form-control"
                disabled={isMembershipSet()}
                value={
                  props?.member?.memberships && props?.member?.memberships[0]
                    ? props?.member?.memberships[0].plan?.id
                    : undefined
                }
              >
                <option></option>
                {membershipPlanList.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {`${getPlanName(plan.type)}, ${plan.price}.-`}
                  </option>
                ))}
              </Field>

              <label htmlFor="startDate">Début</label>
              <Field
                placeholder="Début"
                name="startDate"
                type="date"
                onChange={(event: { target: any }) => {
                  setMembershipStartDate(event.target.value);
                }}
                value={membershipStartDate}
                className="form-control"
                disabled={isMembershipSet()}
              ></Field>

              <Button
                variant="secondary"
                className="cancel"
                hidden={!isMembershipSet()}
                onClick={terminateMembership}
              >
                Interrompre l'abonnement
              </Button>
            </div>

            <hr/>            

            <DeleteBtnWithConfirmation
              buttontext="Supprimer ce membre"
              item={`${initialValues.user.firstname}`}
              onYes={() => deleteMember()}
            />
          </div>
          
          <div className="save-cancel-group memberForm">
            <Link to="/admin/members">
              <Button variant="secondary" className="cancel">
                Annuler
              </Button>
            </Link>

            <Button variant="primary" type="submit" disabled={isSubmitting}>
              Sauver
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
