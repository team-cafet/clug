
export interface IPaymentRequest {
  id?: number;
  amount: number;
  date: Date;
  hasBeenCanceled: boolean;
  description?: string;
}