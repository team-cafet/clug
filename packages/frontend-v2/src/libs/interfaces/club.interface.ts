import { IMember } from "./member.interface";

export interface IClub {
  id: number;
  name: string;
  members: IMember[]
}