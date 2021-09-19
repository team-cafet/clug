import HTTPAuthentifiedService from "./HTTPAuthentifiedService";

class UserService extends HTTPAuthentifiedService {
  protected readonly API_URL = '/api/backoffice/users';

  async getAll() {
    return this.get(this.API_URL);
  }
}

export default UserService;
