export enum Sexe {
  'MALE',
  'FEMALE',
  'NON-BINARY'
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
