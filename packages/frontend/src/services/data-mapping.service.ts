import { PlanType } from '../libs/interfaces/membershipPlan.interface';
import moment from 'moment';

export const getPlanTypeName = (id: number | undefined): string => {
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

export const generatePlanEndDate = (
  startDate: Date,
  planType?: number
): Date => {
  let endDate = moment();

  switch (planType) {
    case PlanType.weekly:
      endDate.add(1, 'weeks');
      break;
    case PlanType.monthly:
      endDate.add(1, 'months');
      break;
    case PlanType.quarterly:
      endDate.add(3, 'months');
      break;
    case PlanType.biannual:
      endDate.add(6, 'months');
      break;
    case PlanType.annual:
      endDate.add(1, 'years');
      break;
    default:
      console.error('not a valid membershipPlan type');
  }

  return endDate.toDate();
};
