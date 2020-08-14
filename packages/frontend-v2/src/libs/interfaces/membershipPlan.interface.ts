export interface IMembershipPlan {
  id: number;
  price: number;
  description?: string;
  type: PlanType;
  tacit: boolean;
}
// todo: how to properly convert enum int to related value ?
export enum PlanType {
  'hebdomadaire',
  'mensuel',
  'trimestriel',
  'semestriel',
  'annuel',
}