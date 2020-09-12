import { IMembership } from "./membership.interface";
import { IUser } from "./user.interface";

export interface IMember {
  id: number;
  balance: number;
  customInformations: any;
  note: string;
  user?: IUser;
  memberships?: IMembership[];
}