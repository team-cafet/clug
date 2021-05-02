import { RESTController } from '../libs/classes/RESTController';
import { PaymentRequest } from '../models/PaymentRequest';
import { getConnection, getRepository } from 'typeorm';
import { Membership } from 'src/models/Membership';

export class PaymentRequestCtrl extends RESTController<PaymentRequest> {
  constructor() {
    super(getRepository(PaymentRequest));
  }

  public async createWithMembership(body: {
    paymentRequest: PaymentRequest;
    membership: Membership;
  }): Promise<PaymentRequest> {
    try {
      let newRequest;
      const transacResult = await getConnection().transaction(
        async (transactionalEntityManager) => {
          newRequest = await transactionalEntityManager
            .getRepository(PaymentRequest)
            .save([
              {
                amount: body.membership.plan.price,
                date: new Date(),
                description: 'demande crée manuellement',
                membership: body.membership,
              },
            ]);
          if (!newRequest) throw new Error('Payment request not created');

          body.membership.paymentRequest = newRequest;

          const updatedMbership = await transactionalEntityManager
            .getRepository(PaymentRequest)
            .save(body.membership);
        }
      );
      return newRequest;
    } catch (error) {
      return null;
    }
  }
}
