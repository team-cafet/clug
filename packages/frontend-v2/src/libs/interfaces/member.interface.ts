import { IUser } from "./user.interface";

export interface IMember {
  id: number;
  user?: IUser;
  balance: number;
  customInformations: any;
  note: string;
}