import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import React, { useState } from 'react';
import {
  Button,
  Container,
  Row,
  Col,
  Form as FormBootstrap,
} from 'react-bootstrap';
import { ReactComponent as EditIcon } from '../../assets/edit.svg';
import { Link, useHistory } from 'react-router-dom';
import { useGetAllFromService } from '../../hooks/useGetAllFromService';
import { IClub } from '../../libs/interfaces/club.interface';
import { IMember } from '../../libs/interfaces/member.interface';
import { IMembershipPlan } from '../../libs/interfaces/membershipPlan.interface';
import { clubService } from '../../services/club.service';
import { memberService } from '../../services/member.service';
import { membershipPlanService } from '../../services/membership-plan.service';
import { FormGroup } from '../molecules/FormGroup';
import moment from 'moment';
import { getPlanTypeName } from '../../services/data-mapping.service';
import { membershipService } from '../../services/membership.service';
import { IMembership } from '../../libs/interfaces/membership.interface';
import { DeleteBtnWithConfirmation } from '../molecules/Buttons/DeleteBtnWithConfirmation';
import { NotificationFailed } from '../molecules/Notifications/NotificationFailed';
import { NotificationSuccess } from '../molecules/Notifications/NotificationSuccess';
import { Thumb } from '../molecules/Thumb';

interface IFormValue {
  global: string;
  picture: any;
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

  const [thumbPicture, setThumbPicture] = useState<string | File | null>(
    props.member ? memberService.getMemberPictureURL(props.member) : null
  );

  const history = useHistory();

  let initialValues: IFormValue = {
    picture: null,
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
    if (!props.member.memberships || !props.member.memberships[0]) return;

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

    if (values.picture) {
      try {
        (values as any).user.pictureURL = (
          await memberService.postPicture(values.picture)
        ).pictureURL;
        delete (values as any).picture;
      } catch (err) {
        console.error(err);
      }
    }

    try {
      (values as any) = {
        ...values,
        club: values.club ? values.club : null,
      };

      if (props.member?.id) {
        if (!isMembershipSet()) {
          await membershipService.add({
            member: props.member,
            startDate: membershipStartDate,
            plan: selectedMembershipPlanID,
          });
        }

        const response = await memberService.update(props.member.id, values);

        const completeURL = response?.data
          ? memberService.getMemberPictureURL(response.data)
          : null;
        setThumbPicture(completeURL);
      } else {
        const response = await memberService.add({
          ...values,
          organisation: { id: props.organisationID },
        });

        const memberResult = response?.data;

        await membershipService.add({
          member: memberResult,
          startDate: membershipStartDate,
          plan: selectedMembershipPlanID,
        });

        backToMemberPage();
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
            <NotificationSuccess
              onClose={() => setDisplayAlertMemberSaved(false)}
            >
              Le membre a bien été sauvé !
            </NotificationSuccess>
          )}

          <ErrorMessage
            name="global"
            component={(props) => (
              <NotificationFailed>{props.children}</NotificationFailed>
            )}
          />

          {/* General member information */}
          <div className="memberForm">
            <Container className="mb-5">
              <Row className="justify-content-center mb-3">
                <div className="d-flex justify-content-center">
                  <Thumb src={thumbPicture} />
                  <Button className="clug-file-input btn btn-primary">
                    <label htmlFor="picture">
                      <EditIcon title="Modifier pic" className="whiteIcon" />
                    </label>
                  </Button>
                </div>
              </Row>
              <Row className="justify-content-center">
                <Col>
                  <FormBootstrap.File
                    id="picture"
                    name="picture"
                    className="clug-hide-input"
                    onChange={(event: any) => {
                      const picture = (event as any)?.currentTarget?.files[0];
                      setFieldValue('picture', picture);
                      setThumbPicture(picture);
                    }}
                  />
                </Col>
              </Row>
            </Container>

            <h1>
              {props.member
                ? 'Modifier le profil de ' + props.member.user?.firstname
                : 'Créer un membre'}
            </h1>

            <label htmlFor="club">Club</label>
            <Field
              component="select"
              multiple={false}
              name="club"
              className="form-control"
            >
              <option key={null} value={undefined}>
                Sélectionner un club...
              </option>
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
                    {`${plan.name}, ${getPlanTypeName(plan.type)}, ${
                      plan.price
                    }.-`}
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

            <hr />

            {props.member?.id && (
              <DeleteBtnWithConfirmation
                buttontext="Supprimer ce membre"
                item={`${initialValues.user.firstname}`}
                onYes={() => deleteMember()}
              />
            )}
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
