import { IOrganisation } from './organisation.interface';

export interface IUser {
  id: number;
  email: string;
  firstname?: string;
  lastname?: string;
  organisation: IOrganisation;
  birthdate: Date;
}
