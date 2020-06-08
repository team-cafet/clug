import { Member } from './member.model';

export interface Club {
  id?: string;
  designation: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  members?: Member[];
}
