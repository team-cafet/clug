import { Member } from './member.model';

export interface Level {
  id?: string;
  name: string;
  description: string;
  members?: Member[];
}
