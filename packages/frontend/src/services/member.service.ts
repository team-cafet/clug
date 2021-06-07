import { APIResource, POST } from './api.service';
import { getToken } from '../services/auth.service';
import { IMember } from '../libs/interfaces/member.interface';

interface IPictureResponse {
  pictureURL: string;
}

class APIMember extends APIResource {
  constructor() {
    super('members');
  }

  async postPicture(picture: any): Promise<IPictureResponse> {
    if (!picture) {
      return { pictureURL: '' };
    }
    
    const result = await POST('members/picture', {picture}, { formdata: true });

    return  { pictureURL: result?.data.pictureURL };
  }

  getMemberPictureURL(member: IMember) {
    if(!member.user?.pictureURL) {
      // TODO: return placeholder if not set
      return null;
    }

    return `/api/members/picture/${member?.user?.pictureURL}?token=${getToken()}`;  
  }
}

export const memberService = new APIMember();
