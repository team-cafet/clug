import { IMembership } from './membership.interface';
import { IUser } from './user.interface';
import { IClub } from './club.interface';

export interface IMember {
  id: number;
  balance: number;
  customInformations: any;
  note: string;
  user?: IUser;
  memberships?: IMembership[];
  club?: IClub;
  createdAt: string;
}
