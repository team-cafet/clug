import {
  Repository,
  FindManyOptions,
  getRepository,
  UpdateResult
} from 'typeorm';
import { APIError } from './APIError';

export class RESTController<T> {
  constructor(protected repository: Repository<T>) {}

  public findAll(options: FindManyOptions = {}): Promise<T[]> {
    return this.repository.find(options);
  }

  public findOneByID(id: number): Promise<T> {
    try {
      return this.repository.findOneOrFail(id);
    } catch (err) {
      throw new APIError(404, `No record found with id ${id}`);
    }
  }

  public store(body: T): Promise<T> {
    try {
      const entity = this.repository.create(body);
      return this.repository.save(entity);
    } catch (err) {
      throw new APIError(500, `Unexpected error: ${err}`);
    }
  }

  public async update(id: number, body: T): Promise<T> {
    const entity = await this.findOneByID(id);
    try {
      this.repository.merge(entity, body);
      return this.repository.save(entity);
    } catch (err) {
      throw new APIError(500, `Unexpected error: ${err}`);
    }
  }

  public async delete(id: number): Promise<UpdateResult> {
    const entity = await this.findOneByID(id);
    try {
      return this.repository.softDelete(entity);
    } catch (err) {
      throw new APIError(500, `Unexpected error: ${err}`);
    }
  }
}
