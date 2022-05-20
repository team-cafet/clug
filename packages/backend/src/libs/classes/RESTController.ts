import {
  Repository,
  FindManyOptions,
  DeleteResult,
  FindOneOptions,
  DeepPartial,
  EntityTarget,
} from 'typeorm';
import { APIError } from './APIError';
import { Request, Response } from 'express';
import { APIMessageList } from './APIMessageList';
import { TypeORMService } from '../services/TypeORMService';

export class RESTController<T> {
  protected repository: Repository<T>;

  constructor(
    protected entity: EntityTarget<T>,
    protected options:
    | undefined
    | {
      findAllOptions?: FindManyOptions;
      findOneOptions?: FindOneOptions;
    } = undefined
  ) {
    this.repository = TypeORMService.getInstance().getRepository(entity);
  }

  public findAll(
    options: FindManyOptions | undefined = undefined
  ): Promise<T[]> {
    if (!options && this.options?.findAllOptions) {
      options = this.options.findAllOptions;
    }

    return this.repository.find(options ? options : {});
  }

  public findOneByID(
    id: number,
    options: FindOneOptions | undefined = undefined
  ): Promise<T> {
    if (!options && this.options?.findOneOptions) {
      options = this.options.findOneOptions;
    } else if (!options) {
      options = { where: {}};
    }

    options.where = {...options?.where, id};

    try {           
      return this.repository.findOneOrFail(options ? options : {});
    } catch (err) {
      throw new APIError(404, APIMessageList.NO_RESOURCE_FOUND_WITH_ID(id));
    }
  }

  public async store(body: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(body);
    return this.repository.save(entity as DeepPartial<T>);
  }

  public async update(id: number, body: DeepPartial<T>): Promise<T> {
    const entity = await this.findOneByID(id);
    this.repository.merge(entity, body);
    return this.repository.save(entity as DeepPartial<T>);
  }

  public async remove(id: number): Promise<DeleteResult> {
    const entity: any = await this.findOneByID(id);
    try {
      return this.repository.softDelete(entity.id);
    } catch (err) {
      throw new APIError(500, APIMessageList.UNEXPECTED_ERROR(err));
    }
  }

  public getAll = async (req: Request, res: Response): Promise<Response> => {
    return res.send(await this.findAll());
  };

  public getOne = async (req: Request, res: Response): Promise<Response> => {
    const id = Number.parseInt(req.params.id);
    return res.send(await this.findOneByID(id));
  };

  public post = async (req: Request, res: Response): Promise<Response> => {
    return res.send(await this.store(req.body));
  };

  public put = async (req: Request, res: Response): Promise<Response> => {
    const id = Number.parseInt(req.params.id);
    return res.send(await this.update(id, req.body));
  };

  public delete = async (req: Request, res: Response): Promise<Response> => {
    const id = Number.parseInt(req.params.id);
    return res.send(await this.remove(id));
  };
}
