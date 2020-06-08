import { Member } from './member.model';

export interface Statistic {
  membersCount: number;
  badPayersCount: number;
  newMembersCount: number;
  averageAge: string; // date
  olderMember: Member;
  youngestMember: Member;
}
