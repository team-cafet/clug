import { Club } from '.';
import { Level } from './level.model';

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
  id?: string;
  firstname: string;
  lastname: string;
  sexe?: Sexe;
  email: string;
  phone?: string;
  birthdate?: Date;
  financialStatus?: FinancialStatus;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  club?: Club;
  level?: Level;
}

export function displaySexe(sexe: Sexe): string {
  switch (sexe) {
    case Sexe.FEMALE:
      return 'F';
    case Sexe.MALE:
      return 'M';
    case Sexe.NON_BINARY:
      return '-';
    default:
      return '-';
  }
}

export function displayFinancialStatus(financialStatus: FinancialStatus): string {
  switch (financialStatus) {
    case FinancialStatus.OK:
      return 'OK';
    case FinancialStatus.ALERT:
      return 'ALERT';
    case FinancialStatus.WARNING:
      return 'WARNING';

    default:
      return 'UKNOWN';
  }
}
