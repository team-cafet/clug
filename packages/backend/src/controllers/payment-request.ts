import { RESTController } from '../libs/classes/RESTController';
import { PaymentRequest } from '../models/PaymentRequest';
import { Membership } from '../models/Membership';
import { TypeORMService } from '../libs/services/TypeORMService';

export class PaymentRequestCtrl extends RESTController<PaymentRequest> {
  constructor() {
    super(PaymentRequest);
  }

  public async createWithMembership(body: {
    paymentRequest: PaymentRequest;
    membership: Membership;
  }): Promise<PaymentRequest> {
    try {
      let newRequest;
      await TypeORMService.getInstance().getDataSource().transaction(
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

          await transactionalEntityManager
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
