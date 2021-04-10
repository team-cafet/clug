import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { IMembership } from '../../../libs/interfaces/membership.interface';
import {} from '../../../services/member.service';
import { membershipService } from '../../../services/membership.service';
import { Tabs, Tab } from 'react-bootstrap';
import { DataTable } from '../../molecules/DataTable';
import { paymentRequestService } from '../../../services/paymentRequest.service';
import { IPayment } from '../../../libs/interfaces/payment.interface';
import { paymentService } from '../../../services/payment.service';
import { getPlanTypeName } from '../../../services/data-mapping.service';
import { PaymentCard } from '../../molecules/paymentCard';
import { Tabs, Tab, Button } from 'react-bootstrap';
import { DataTable } from '../../molecules/DataTable';
import { getPlanName } from '../../../services/data-mapping.service';
import { paymentRequestService } from '../../../services/paymentRequest.service';

export const Payment = () => {
  const [memberships, setMemberships] = useState<IMembership[]>([]);
  const [allMemberships, setAllMemberships] = useState<IMembership[]>([]);
  const tabLateTitle = `Paiements d'abos échus (${memberships.length})`;
  const tabRunningTitle = `Paiements d'abos en cours (${allMemberships.length})`;

  const getNotPaidMemberships = async (): Promise<void> => {
    const memberships = await membershipService.getNotPaid();
    setMemberships(memberships?.data);
  };
  const getAllMemberships = async (): Promise<void> => {
    const allMemberships = await membershipService.getAll();
    setAllMemberships(allMemberships?.data);
  };
  const [alreadyRequested,] = useState<boolean>(false);
  
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

  console.log(allMemberships);
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
      accessor: 'planPrice',
      disableFilters: true,
      disableSortBy: false,
    },
    {
      Header: '',
      accessor: 'lol',
      disableFilters: true,
      disableSortBy: true,
      Cell: (cell: any) => <><button
      type="button"
      className="btn btn-secondary"
      onClick={async () => createPaymentRequest(cell)}
      disabled={alreadyRequested}
    >
      Paiment demandé
    </button> 
    <Button>Paiement reçu</Button></>,
    },
  ];

  useEffect(() => {
    getNotPaidMemberships();
    getAllMemberships();
  }, []);
  const paymentReceived = async () => {
    await getNotPaidMemberships();
  };
  return (
    <div>
      <h1>Gestion des paiements</h1>
      <p>Nous sommes le{' '}
        <u>{moment().locale('fr').format('LL')}</u>
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
    </div>
  );
};
