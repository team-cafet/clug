import { PlanType } from '../libs/interfaces/membershipPlan.interface';
import moment from 'moment';

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

export const generatePlanEndDate = (startDate: Date, planType: number): Date => {
  let endDate = moment();

  switch (planType) {
    case PlanType.weekly:
      endDate.add(1, 'weeks');
    case PlanType.monthly:
      endDate.add(1, 'months');
    case PlanType.quarterly:
      endDate.add(3, 'months');
    case PlanType.biannual:
      endDate.add(6, 'months');
    case PlanType.annual:
      endDate.add(1, 'years');
  }

  return endDate.toDate()
};
