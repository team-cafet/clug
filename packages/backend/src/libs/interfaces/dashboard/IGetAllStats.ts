import { Member } from '../../../models/Member';

export interface IGetAllStats {
  birthdays: Member[];
  negativeBalanceUsers: Member[];
  totalMembers: Member[];
}
