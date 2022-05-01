import { IOrganisation } from './organisation.interface';
import { IPerson } from './person.interface';

export interface IUser {
  id?: number;
  organisation: IOrganisation;
  person: IPerson;
  pictureURL?: string;
}
