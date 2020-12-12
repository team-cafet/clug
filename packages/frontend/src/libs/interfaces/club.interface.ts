import { IMember } from "./member.interface";

export interface IClub {
  id: number;
  name: string;
  description: string;
  members: IMember[]
}
