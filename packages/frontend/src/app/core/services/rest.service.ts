import { ApiService } from './api.service';

export class RESTService {
  constructor(
    private readonly RESOURCE_ADDRESS: string,
    private readonly apiService: ApiService
  ) {}

  async getAll() {
    return this.apiService.get(this.RESOURCE_ADDRESS);
  }

  async getOneById(id) {
    return this.apiService.get(`${this.RESOURCE_ADDRESS}${id}`);
  }

  async saveOne(ele) {
    if (!ele.id) {
      throw new Error('Can not save an element without his id');
    }

    return this.apiService.put(`${this.RESOURCE_ADDRESS}${ele.id}`, ele);
  }

  async addOne(ele) {
    return this.apiService.post(`${this.RESOURCE_ADDRESS}`, ele);
  }

  async delete(ele) {
    return this.apiService.delete(`${this.RESOURCE_ADDRESS}${ele.id}`);
  }
}
