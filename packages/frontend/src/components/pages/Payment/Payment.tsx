import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { IMembership } from '../../../libs/interfaces/membership.interface';
import {} from '../../../services/member.service';
import { membershipService } from '../../../services/membership.service';
import { Tabs, Tab } from 'react-bootstrap';
import { DataTable } from '../../molecules/DataTable';
import { paymentRequestService } from '../../../services/paymentRequest.service';
import { IPayment } from '../../../libs/interfaces/payment.interface';
import { paymentService } from '../../../services/payment.service';
import { getPlanTypeName } from '../../../services/data-mapping.service';

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
      await paymentRequestService.createPaymenRequestAndUpdateMembership(
        {
          paymentRequest: {
            amount: membership.plan.price,
            date: new Date(),
            description: 'demandé manuellement',
            hasBeenCanceled: false,
          },
          membership,
        }
      );
      
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
      Cell: (cell: any) => `${cell.value.firstname} ${cell.value.lastname}`,
    },
    {
      Header: 'Abonnement',
      accessor: 'plan.type',
      disableFilters: true,
      disableSortBy: false,
      Cell: (cell: any) => getPlanTypeName(cell.value),
    },
    {
      Header: 'Echéance',
      accessor: 'endDate',
      disableFilters: true,
      disableSortBy: false,
      Cell: (cell: any) => `${moment(cell.value).locale('fr').format('LL')}`,
    },
    {
      Header: 'Prix',
      accessor: 'plan.price',
      disableFilters: true,
      disableSortBy: false,
    },
    {
      Header: '',
      accessor: 'any',
      disableFilters: true,
      disableSortBy: true,
      Cell: (cell: any) => (
        <>
          <button
            type="button"
            className="btn btn-secondary smallMarginRight"
            onClick={async () => createPaymentRequest(cell.row.original)}
            disabled={!!cell.row.original.paymentRequest}
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
      ),
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
      <p>
        Nous sommes le <u>{moment().locale('fr').format('LL')}</u>
      </p>
      <p>En attente d'action: {memberships.length}</p>
      <Tabs defaultActiveKey={'late'}>
        <Tab eventKey="late" title={tabLateTitle} className="overflow">
          <DataTable
            data={memberships}
            // test if in mobile mode, change columns or other solution
            columns={COLUMNS}
          />
        </Tab>
        <Tab eventKey="running" title={tabRunningTitle}>
          <DataTable
            data={allMemberships}
            // test if in mobile mode, change columns or other solution
            columns={COLUMNS}
          />
        </Tab>
      </Tabs>
    </div>
  );
};
