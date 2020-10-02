import { IMembership } from "./membership.interface";
import { IUser } from "./user.interface";
import { IMemberLabel } from "./memberLabel.interface";

export interface IMember {
  id: number;
  balance: number;
  customInformations: any;
  note: string;
  user?: IUser;
  memberships?: IMembership[];
  memberLabels?: IMemberLabel[];
}