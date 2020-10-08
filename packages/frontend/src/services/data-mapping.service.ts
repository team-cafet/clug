import { PlanType } from '../libs/interfaces/membershipPlan.interface';

export const getPlanName = (id: number | undefined): string => {
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
      return 'spécial';
  }
};

export const getPlanDurationInMonth = (id: number | undefined): string => {
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
      return 'spécial';
  }
};
