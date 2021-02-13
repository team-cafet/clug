import { RESTController } from '../libs/classes/RESTController';
import { Payment } from '../models/Payment';
import { EntityManager, getConnection, getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { PaymentRequest } from '../models/PaymentRequest';
import { Membership } from '../models/Membership';

export class PaymentCtrl extends RESTController<Payment> {
  constructor() {
    super(getRepository(Payment));
  }

  public createPaymentWithoutRequest = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { payment, membership: membership } = req.body;
    if (!payment || !membership) return res.status(400).send('wrong request');
    let newPayment;
    try {
      const transacResult = await getConnection().transaction(
        async (transactionalEntityManager) => {
          const newRequest = await this.createPaymentRequest(
            transactionalEntityManager,
            membership
          );
          if (!newRequest) throw new Error('Payment request not created');
          const newPayment = await this.createPayment(
            transactionalEntityManager,
            newRequest,
            membership
          );
          if (!newPayment) throw new Error('Payment not created');
        }
      );
      return res.status(201).send(newPayment);
    } catch (error) {
      console.error(error);
      return res.status(400).send('Error during payment creation');
    }
  };

  private createPaymentRequest = async (
    transaction: EntityManager,
    membership: Membership
  ): Promise<PaymentRequest> => {
    const requestEntity = transaction.getRepository(PaymentRequest).create([
      {
        amount: membership.plan.price,
        date: new Date(),
        description: 'demande crée automatiquement',
        membership: membership
      }
    ]);
    const newRequest = (
      await transaction.getRepository(PaymentRequest).save(requestEntity)
    )[0];
    return newRequest;
  };
  private createPayment = async (
    transaction: EntityManager,
    paymentRequest: PaymentRequest,
    membership: Membership
  ): Promise<Payment> => {
    const paymentEntity = transaction.getRepository(Payment).create([
      {
        amount: paymentRequest.amount,
        date: paymentRequest.date,
        member: membership.member,
        paymentRequest: { id: paymentRequest.id }
      }
    ]);
    return (await transaction.getRepository(Payment).save(paymentEntity))[0];
  };
}
