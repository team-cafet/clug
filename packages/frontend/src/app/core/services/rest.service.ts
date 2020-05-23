import { ApiService } from './api.service';

export class RESTService {
  constructor(
    private readonly RESSOURCE_ADDRESS: string,
    private readonly apiService: ApiService
  ) {}

  async getAll() {
    return this.apiService.get(this.RESSOURCE_ADDRESS);
  }

  async getOneById(id) {
    return this.apiService.get(`${this.RESSOURCE_ADDRESS}${id}`);
  }

  async saveOne(ele) {
    if (!ele.id) {
      throw new Error('Can not save an element without his id');
    }

    return this.apiService.put(`${this.RESSOURCE_ADDRESS}${ele.id}`, ele);
  }

  async addOne(ele) {
    return this.apiService.post(`${this.RESSOURCE_ADDRESS}`, ele);
  }

  async delete(ele) {
    return this.apiService.delete(`${this.RESSOURCE_ADDRESS}${ele.id}`);
  }
}
