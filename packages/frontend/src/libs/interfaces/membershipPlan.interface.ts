import { IMembership } from "./membership.interface";

export interface IMembershipPlan {
  id: number;
  price: number;
  description?: string;
  type: number;
  tacit: boolean;
  memberships: IMembership[];
}

export enum PlanType {
  weekly,
  monthly,
  quarterly,
  biannual,
  annual,
}
