import { RESTController } from '../libs/classes/RESTController';
import { Payment } from '../models/Payment';
import { getConnection, getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { PaymentRequest } from '../models/PaymentRequest';

export class PaymentCtrl extends RESTController<Payment> {
  constructor() {
    super(getRepository(Payment));
  }

  public createPaymentWithoutRequest = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { payment, memberShip } = req.body;
    if (!payment || !memberShip) return res.status(400).send('wrong request');
    let newPayment;
    try {
      const transacResult = await getConnection().transaction(
        async (transactionalEntityManager) => {
          const requestEntity = transactionalEntityManager
            .getRepository(PaymentRequest)
            .create([
              {
                amount: memberShip.plan.price,
                date: new Date(),
                description: 'demande crée automatiquement',
                membership: memberShip
              }
            ]);
          const newRequest = (
            await transactionalEntityManager
              .getRepository(PaymentRequest)
              .save(requestEntity)
          )[0];
          if (!newRequest) throw new Error();
          const paymentEntity = transactionalEntityManager
            .getRepository(Payment)
            .create([
              {
                amount: newRequest.amount,
                date: newRequest.date,
                member: memberShip.member,
                paymentRequest: { id: newRequest.id }
              }
            ]);
            newPayment = (
            await transactionalEntityManager
              .getRepository(Payment)
              .save(paymentEntity)
          )[0];
          if (!newPayment) throw new Error();
        }
      );

      return res.status(201).send(newPayment);
    } catch (error) {
      return res.status(400).send('Error during payment creation');
    }
  };
}
