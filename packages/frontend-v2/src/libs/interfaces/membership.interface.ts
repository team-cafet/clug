import { IMember } from "./member.interface";
import { IMembershipPlan } from "./membershipPlan.interface";
import { IPaymentRequest } from "./paymentRequest.interface";

export interface IMembership {
  id: number;
  startDate: Date;
  endDate: Date;
  note: string;
  paymentRequest?: IPaymentRequest;
  member?: IMember;
  plan?: IMembershipPlan;
}