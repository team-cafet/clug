import { IUser } from "./user.interface";
import { IMemberLabel } from "./memberLabel.interface";

export interface IMember {
  id: number;
  user?: IUser;
  balance: number;
  customInformations: any;
  note: string;
  memberLabels?: IMemberLabel[];
}