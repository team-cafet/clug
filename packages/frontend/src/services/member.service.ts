import { APIResource, POST } from './api.service';

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
}

export const memberService = new APIMember();
