import HTTPAuthentifiedService from "./HTTPAuthentifiedService";

class OrganisationService extends HTTPAuthentifiedService {
  protected readonly API_URL = '/api/backoffice/organisations';

  async getAll() {
    return this.get(this.API_URL);
  }
  
  async createNewOrganisationAndUser(
    organisation: {name: string}, 
    user: {email: string, password: string, firstname: string, lastname: string, username: string}  
  ) {
    return this.post(`${this.API_URL}/with-user`, {organisation, user});
  }
}

export default OrganisationService;
