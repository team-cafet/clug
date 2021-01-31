import { APIResource } from './api.service';
class APIMember extends APIResource {
    constructor() {
      super('members');
    }
  }
  
export const memberService = new APIMember();