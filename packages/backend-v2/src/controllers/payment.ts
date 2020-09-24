import { RESTController } from '../libs/classes/RESTController';
import { Payment } from '../models/Payment';
import { getRepository } from 'typeorm';
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
    try {
      const requestEntity = getRepository(PaymentRequest).create([
        {
          amount: memberShip.plan.price,
          date: new Date(),
          description: 'demande crée automatiquement'
        }
      ]);
      const newRequest = (await getRepository(PaymentRequest).save(
        requestEntity
      ))[0];
      if(!newRequest) throw new Error();
      const paymentEntity = getRepository(Payment).create([
        {
          amount: newRequest.amount,
          date: newRequest.date,
          member: memberShip.member,
          paymentRequest: {id: newRequest.id}
        }
      ]);
      const newPayment = (await getRepository(Payment).save(paymentEntity))[0];
      if(!newPayment) throw new Error();
      return res.status(201).send(newPayment);
    } catch (error) {
      return res.status(400).send('Error during payment creation');
    }
  };
}
