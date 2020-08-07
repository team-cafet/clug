import { RESTController } from '../libs/classes/RESTController';
import { Membership } from '../models/Membership';
import { getRepository } from 'typeorm';
import { MemberCtrl } from './member';
import { Member } from '../models/Member';

export class MembershipCtrl extends RESTController<Membership> {
  constructor() {
    super(getRepository(Membership));
  }

  public async businessValidation(req: Request, res, next): Promise<void> {
    const data: Membership = (req.body as unknown) as Membership;
    //startDate < endDate
    const startDate: Date = new Date(data.startDate);
    const endDate: Date = new Date(data.endDate);
    if (startDate.getTime() >= endDate.getTime()) {
      return res
        .status(400)
        .send('La date de début est après ou égale à la date de fin');
    }
    //only one active membership by member
    const memberCtrl = new MemberCtrl();
    const member: Member = await memberCtrl.findOneByID(data.member.id);
    
    if(member.memberships && member.memberships.length > 0){
      member.memberships.forEach((membership) => {
        const memberStart = new Date(membership.startDate);
        const memberEnd = new Date(membership.endDate);
        if (
          (memberEnd.getTime() >= endDate.getTime() && 
          memberEnd.getTime() <= startDate.getTime()) ||
          (memberStart.getTime() >= startDate.getTime() && 
          memberStart.getTime() <= endDate.getTime())
        ) {
          return res
          .status(400)
          .send('Un abonnement est déjà actif');
        }
      });
    }
    
    next();
  }
}
