import { DataSource, EntityTarget, Repository } from 'typeorm';
import { connectionOptions } from '../../config/database';
import { ILoadableService } from '../interfaces/service/ILoadableService';

export class TypeORMService implements ILoadableService {
  private static service: TypeORMService;
  private dataSource: DataSource;
  
  public async load(): Promise<void> {
    if(! this.dataSource.isInitialized) {
      await this.dataSource.initialize();
    }
  } 

  public static getInstance(): TypeORMService  {
    if(! this.service) {
      this.service = new TypeORMService();
    }

    return this.service;
  }
  
  public getDataSource(): DataSource {
    if(! this.dataSource.isInitialized) {
      throw new Error('DataSource not initialized');
    }

    return this.dataSource;
  }
  
  public getRepository<Entity>(entity: EntityTarget<Entity>): Repository<Entity>  {
    return this.dataSource.getRepository(entity);
  }

  private constructor() {
    const options = connectionOptions();
    this.dataSource = new DataSource(options);
  }
}
