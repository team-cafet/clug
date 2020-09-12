import { IPaymentRequest } from "./paymentRequest.interface";

export interface IMembership {
  id: number;
  startAt: Date;
  endAt: Date;
  paymentRequest?: IPaymentRequest;
  note: string;
}