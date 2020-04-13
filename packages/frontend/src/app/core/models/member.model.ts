export enum Sexe {
  'MALE',
  'FEMALE',
  'NON_BINARY'
}

export enum FinancialStatus {
  'OK',
  'WARNING',
  'ALERT'
}

export interface Member {
  id: string;
  name: string;
  surname: string;
  sexe: Sexe;
  email: string;
  phone: string;
  birthdate: Date;
  financialStatus: FinancialStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export function displaySexe(sexe: Sexe): string {
  switch (sexe) {
    case Sexe.FEMALE:
      return 'F';
      break;
    case Sexe.MALE:
      return 'M';
      break;
    case Sexe['NON_BINARY']:
      return '-';
      break;
    default:
      return '-';
      break;
  }
}

export function displayFinancialStatus(financialStatus: FinancialStatus): string {
  switch (financialStatus) {
    case FinancialStatus.OK:
      return 'OK';
      break;
    case FinancialStatus.ALERT:
      return 'ALERT';
      break;
    case FinancialStatus.WARNING:
      return 'WARNING';
      break;

    default:
      return 'UKNOWN';
      break;
  }
}
