import {
  Repository,
  FindManyOptions,
  DeleteResult,
  FindOneOptions,
} from 'typeorm';
import { APIError } from './APIError';
import { Request, Response } from 'express';
import { APIMessageList } from './APIMessageList';

export class RESTController<T> {
  constructor(
    protected repository: Repository<T>,
    protected options:
      | undefined
      | {
          findAllOptions?: FindManyOptions;
          findOneOptions?: FindOneOptions;
        } = undefined
  ) {}

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
    try {
      if (!options && this.options?.findOneOptions) {
        options = this.options.findOneOptions;
      }

      return this.repository.findOneOrFail(id, options ? options : {});
    } catch (err) {
      throw new APIError(
        404,
        APIMessageList.NO_RESOURCE_FOUND_WITH_ID(id)
      );
    }
  }

  public async store(body: T): Promise<T> {
    try {
      const entity = this.repository.create(body);
      return this.repository.save(entity);
    } catch (err) {
      throw new APIError(500, APIMessageList.UNEXPECTED_ERROR(err));
    }
  }

  public async update(id: number, body: T): Promise<T> {
    const entity = await this.findOneByID(id);
    try {
      this.repository.merge(entity, body);
      return this.repository.save(entity);
    } catch (err) {
      throw new APIError(500, APIMessageList.UNEXPECTED_ERROR(err));
    }
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
