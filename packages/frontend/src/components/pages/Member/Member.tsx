import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Dropdown, Spinner } from 'react-bootstrap';
import { useGetAllFromService } from '../../../hooks/useGetAllFromService';
import { IMember } from '../../../libs/interfaces/member.interface';
import { memberService } from '../../../services/member.service';
import { DataTable } from '../../molecules/DataTable';
import './Member.scss';
import '../../organisms/forms.scss';
import { DeleteBtnWithConfirmation } from '../../molecules/Buttons/DeleteBtnWithConfirmation';
import { ButtonWithConfirmation } from '../../molecules/Buttons/ButtonWithConfirmation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollar, faPen } from '@fortawesome/free-solid-svg-icons';
import { IMembership } from '../../../libs/interfaces/membership.interface';
import { IPayment } from '../../../libs/interfaces/payment.interface';
import { paymentService } from '../../../services/payment.service';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';

export const Member = () => {
  const [members, , setMembers] = useGetAllFromService<IMember>({
    service: memberService,
  });

  //Check if any membership are not link to a payment
  const isABadBoy = (member: IMember) => {
    const gdMemberShip = member.memberships?.filter(
      (membership) => !!!membership.paymentRequest?.payment
    );
    return gdMemberShip && gdMemberShip.length > 0;
  };

  //isAGoodBoy(members[0])
  const COLUMNS: any[] = [
    {
      Header: 'Nom',
      accessor: 'name',
    },
    {
      Header: '',
      accessor: 'id',
      disableFilters: true,
      disableSortBy: true,
      Cell: (cell: any) => <GoToMemberBtn id={cell.value} />,
    },
    {
      Header: '',
      accessor: 'id',
      id: 'gotPayment',
      disableFilters: true,
      disableSortBy: true,
      Cell: (cell: any) => <GotPaymentBtn member={cell.row.original} />,
    },
    {
      Header: '',
      accessor: 'id',
      id: 'deleteMember',
      disableFilters: true,
      disableSortBy: true,
      Cell: (cell: any) => (
        <DeleteBtnWithConfirmation
          buttontext=""
          item="ce membre"
          onYes={() => {
            memberService.delete(cell.value);
            let copyData = [...members];
            copyData.splice(cell.index, 1);
            setMembers(copyData);
          }}
          className="warning btn-icon"
          title="Supprimer ce membre"
        />
      ),
    },
  ];

  const DATA = useMemo(() => {
    return members
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .map((member) => ({
        id: member.id,
        name: `${member.user?.firstname} ${member.user?.lastname}`,
        negativeBalance: member.balance < 0,
        memberships: member.memberships,
        isABadBoy: isABadBoy(member),
      }));
  }, [members]);

  return (
    <>
      <h1>Membres</h1>
      <div className="container">
        <div className="row">
          <Link
            to="/admin/members/add"
            className="btn btn-secondary add"
            title="Ajouter un membre"
          >
            +
          </Link>
        </div>
        <div className="row">
          <DataTable
            data={DATA}
            columns={COLUMNS}
            customRowProps={(row: any) => ({
              className: DATA[row.index]?.negativeBalance
                ? 'member-table__row--negative-balance'
                : '',
            })}
          />
        </div>
      </div>
    </>
  );
};

const GoToMemberBtn = (props: { id: number }) => {
  return (
    <Link to={`/admin/members/${props.id}`}>
      <Button className="btn-icon" title="Editer le membre">
        <FontAwesomeIcon icon={faPen} />
      </Button>
    </Link>
  );
};

interface MemberCustom {
  id: number;
  name: string;
  isABAdBoy: boolean;
  negativeBalance: boolean;
  memberships: IMembership[];
}

const GotPaymentBtn = (props: { member: MemberCustom }) => {
  //console.log(props.member);
  //const [memberships, setMemberships] = useState<IMembership[]>(props.member.memberships);
  const [alreadyRequested] = useState<boolean>(false);
  //COPIED FROM WHAT WAS MADE IN PAYMENT PAGE
  const createPayment = async (memberShip: IMembership): Promise<void> => {
    if (!memberShip.plan) return;
    let paymentData: IPayment = {
      amount: memberShip.plan.price,
      date: new Date(),
      hasBeenCanceled: false,
    };
    //capte pas la cuisine faite ici
    try {
      let newPayment;
      if (alreadyRequested) {
        paymentData.paymentRequest = memberShip.paymentRequest;
        paymentData.member = memberShip.member;
        newPayment = await paymentService.add(paymentData);
      } else {
        newPayment = await paymentService.createPaymentWithoutRequest({
          payment: paymentData,
          membership: memberShip,
        });
      }
      if (newPayment) {
        //paymentReceived();
      }
    } catch (error) {
      console.error(error);
    }
  };
  /*  const getNotPaidMemberships = async (): Promise<void> => {
    const memberships = await membershipService.getNotPaid();
    setMemberships(memberships?.data);
  };
  const paymentReceived = async () => {
    await getNotPaidMemberships();
  }; */
  if (!props.member.memberships)
    return <Spinner animation="grow" variant="primary" size="sm" />;
  else
    return (
      <>
        {props.member.memberships === undefined ||
        props.member.memberships.length <= 1 ? (
          <ButtonWithConfirmation
            modal={{
              title: 'Supprimer',
              body: `Valider que le paiement est reçu pour ${props.member.name} ?`,
              cancelText: 'Annuler',
              acceptText: 'Oui',
            }}
            onYes={async () => {
              if (props.member.memberships)
                return createPayment(props.member.memberships[0]);
            }}
            onNo={() => {}}
            className="btn-icon"
            title="Paiement reçu"
            disabled={
              props.member.memberships === undefined ||
              props.member.memberships.length === 0
            }
          >
            <FontAwesomeIcon icon={faDollar} />
          </ButtonWithConfirmation>
        ) : (
          <div>
            <Dropdown>
              <Dropdown.Toggle>
                <FontAwesomeIcon icon={faDollar} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {props.member.memberships.map((membership) => (
                  <DropdownItem>
                    <ButtonWithConfirmation
                      modal={{
                        title: 'Supprimer',
                        body: `Valider que le paiement de l'abonnement finissant le ${membership.endDate} est reçu pour ${props.member.name} ?`,
                        cancelText: 'Annuler',
                        acceptText: 'Oui',
                      }}
                      onYes={async () => {
                        if (props.member.memberships)
                          return createPayment(membership);
                      }}
                      onNo={() => {}}
                      className="btn-icon"
                      title="Paiement reçu"
                      disabled={
                        props.member.memberships === undefined ||
                        props.member.memberships.length === 0
                      }
                    >
                      Fin: {membership.endDate}
                    </ButtonWithConfirmation>
                  </DropdownItem>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        )}
      </>
    );
};
