export interface IMembershipPlan {
  id: number;
  price: number;
  description?: string;
  type: PlanType;
  tacit: boolean;
}

export enum PlanType {
  weekly,
  monthly,
  quarterly,
  biannual,
  annual,
}
