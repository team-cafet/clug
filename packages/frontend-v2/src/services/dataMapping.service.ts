export const planTypeMapper = (id: number): string => {
  let result: string = '';
  switch (id) {
    case 1:
      result = 'hebdomadaire';
      break;
    case 2:
      result = 'mensuel';
      break;
    case 3:
      result = 'trimestriel';
      break;
    case 4:
      result = 'semestriel';
      break;
    case 5:
      result = 'annuel';
      break;
    default:
      result = 'autre';
      break;
  }
  return result;
};
export enum PlanType {
  'hebdomadaire',
  'mensuel',
  'trimestriel',
  'semestriel',
  'annuel',
}
