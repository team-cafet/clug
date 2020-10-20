import { IMember } from './member.interface';
import { IPaymentRequest } from './paymentRequest.interface';

export interface IPayment {
  id?: number;
  amount: number;
  date: Date;
  hasBeenCanceled: boolean;
  member?: IMember;
  paymentRequest?: IPaymentRequest;
}
