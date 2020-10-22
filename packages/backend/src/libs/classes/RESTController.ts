import {
  Repository,
  FindManyOptions,
  getRepository,
  UpdateResult,
  DeleteResult,
  InsertResult
} from 'typeorm';
import { APIError } from './APIError';
import { Request, Response } from 'express';

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

  public async store(body: T): Promise<T> {
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

  public async remove(id: number): Promise<DeleteResult> {
    const entity: any = await this.findOneByID(id);
    try {
      return this.repository.softDelete(entity.id);
    } catch (err) {
      throw new APIError(500, `Unexpected error: ${err}`);
    }
  }


  public getAll = async (req: Request, res: Response): Promise<Response> => {
    return res.send(await this.findAll());
  }

  public getOne = async (req: Request, res: Response): Promise<Response> => {
    const id = Number.parseInt(req.params.id);
    return res.send(await this.findOneByID(id));
  }

  public post = async (req: Request, res: Response): Promise<Response> => {
    return res.send(await this.store(req.body));
  }

  public put = async (req: Request, res: Response): Promise<Response> => {
    const id = Number.parseInt(req.params.id);
    return res.send(await this.update(id, req.body));
  }

  public delete = async (req: Request, res: Response): Promise<Response> => {
    const id = Number.parseInt(req.params.id);
    return res.send(await this.remove(id));
  }
}
