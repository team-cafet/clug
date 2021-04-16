import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { IMembership } from '../../../libs/interfaces/membership.interface';
import {} from '../../../services/member.service';
import { membershipService } from '../../../services/membership.service';
import { PaymentCard } from '../../molecules/paymentCard';
<<<<<<< Updated upstream
=======
import { Tabs, Tab, Button } from 'react-bootstrap';
import { DataTable } from '../../molecules/DataTable';
import { getPlanName } from '../../../services/data-mapping.service';
import { paymentRequestService } from '../../../services/paymentRequest.service';
import { createCallChain } from 'typescript';
import { IPayment } from '../../../libs/interfaces/payment.interface';
import { paymentService } from '../../../services/payment.service';
>>>>>>> Stashed changes

export const Payment = () => {
  const [memberships, setMemberships] = useState<IMembership[]>([]);

  const getNotPaidMemberships = async (): Promise<void> => {
    const memberships = await membershipService.getNotPaid();
    setMemberships(memberships?.data);
  };
<<<<<<< Updated upstream
=======
  const getAllMemberships = async (): Promise<void> => {
    const allMemberships = await membershipService.getAll();
    setAllMemberships(allMemberships?.data);
  };
  const [alreadyRequested, setAlreadyRequested] = useState<boolean>(false);
  /* useEffect(() => {
    if (memberShip.paymentRequest) setAlreadyRequested(true);
  }, [memberShip.paymentRequest]); */


  const createPaymentRequest = async (
    membership: IMembership
  ): Promise<void> => {
    if (!membership.plan) return; // TODO: how to correctly check non nullity of some fields more globally ?
    try {
      const newPaymentRequest = await paymentRequestService.add({
        amount: membership.plan.price,
        date: new Date(),
        description: 'demandé manuellement',
      });
      await membershipService.update(membership.id, {
        paymentRequest: newPaymentRequest?.data,
      });
      setAlreadyRequested(true);
    } catch (e) {
      console.error('error on createPaymentRequest()', e);
    }
  };
  const createPayment = async (memberShip: IMembership): Promise<void> => {
    if (!memberShip.plan) return;
    let paymentData: IPayment = {
      amount: memberShip.plan.price,
      date: new Date(),
      hasBeenCanceled: false,
    };

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
        paymentReceived();
      }
    } catch (error) {
      console.error(error);
    }
  };


  const COLUMNS: any[] = [
    {
      Header: 'Concerne',
      accessor: 'member.user',
      Cell: (cell: any) => `${cell.value.firstname} ${cell.value.lastname}`
    },
    {
      Header: 'Abonnement',
      accessor: 'plan.type',
      disableFilters: true,
      disableSortBy: false,
      Cell: (cell: any) => getPlanName(cell.value)
    },
    {
      Header: 'Echéance',
      accessor: 'endDate',
      disableFilters: true,
      disableSortBy: false,
      Cell: (cell: any) => `${moment(cell.value).locale('fr').format('LL')}`
    },
    {
      Header: 'Prix',
      accessor: 'plan.price',
      disableFilters: true,
      disableSortBy: false,
    },
    {
      Header: '',
      accessor: '',
      id: 'actions',
      disableFilters: true,
      disableSortBy: true,
      Cell: (cell: any) => <>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={async () => createPaymentRequest(cell.row.original)}
        disabled={alreadyRequested}
      >
      Paiment demandé
      </button> 
      <button
        type="button"
        className="btn btn-primary"
        onClick={async () => createPayment(cell.row.original)}
      >
        Argent reçu
      </button>
      </>
    },
  ];

  console.log(memberships);

>>>>>>> Stashed changes
  useEffect(() => {
    getNotPaidMemberships();
  }, []);
  const paymentReceived = async () => {
    await getNotPaidMemberships();
  };
  return (
    <div>
      <h1>
        Gestion de paiements, nous sommes le{' '}
        <u>{moment().locale('fr').format('LL')}</u>
<<<<<<< Updated upstream
      </h1>
      {memberships.map((membership) => (
        <PaymentCard
          key={membership.id}
          memberShip={membership}
          onPaymentReceivedFunction={() => {
            paymentReceived();
          }}
        ></PaymentCard>
      ))}
=======
      </p>
      <p>En attente d'action:{' '}{memberships.length}</p>
      <Tabs
        defaultActiveKey={'late'}
      >
        <Tab eventKey="late" title={tabLateTitle}>
          {memberships.map((membership) => (
            <PaymentCard
              key={membership.id}
              memberShip={membership}
              onPaymentReceivedFunction={() => {
                paymentReceived();
              }}
            ></PaymentCard>
          ))}
        </Tab>
        <Tab eventKey="running" title={tabRunningTitle}>
          <DataTable 
            data={allMemberships}
            columns={COLUMNS}
          />
        </Tab>
      </Tabs>
>>>>>>> Stashed changes
    </div>
  );
};
