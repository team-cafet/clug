import { PlanType } from '../libs/interfaces/membershipPlan.interface';

export const planTypeMapper = (id: number): string => {
  switch (id) {
    case PlanType.weekly:
      return 'hebdomadaire';
    case PlanType.monthly:
      return 'mensuel';
    case PlanType.quarterly:
      return 'trimestriel';
    case PlanType.biannual:
      return 'semestriel';
    case PlanType.annual:
      return 'annuel';
    default:
      return '-';
  }
};
