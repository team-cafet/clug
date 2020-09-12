import { IPaymentRequest } from "./paymentRequest.interface";

export interface IMembership {
  id: number;
  startDate: Date;
  endDate: Date;
  paymentRequest?: IPaymentRequest;
  note: string;
}