import {
  Repository,
  FindManyOptions,
  getRepository,
  UpdateResult,
  DeleteResult
} from 'typeorm';
import { APIError } from './APIError';
import { MembershipPlan } from 'src/models/MembershipPlan';

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

  public async delete(id: number): Promise<DeleteResult> {
    
    const entity: MembershipPlan = await this.findOneByID(id);
    try {
      return await this.repository.softDelete(entity.id);
    } catch (err) {
      throw new APIError(500, `Unexpected error: ${err}`);
    }
  }
}
