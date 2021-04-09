import { Factory } from '../libs/classes/Factory';
import { ISeeds } from '../libs/interfaces/ISeeds';
import { Organisation } from '../models/Organisation';
import { getConnection, getRepository } from 'typeorm';
import { TagFactory } from './factory/TagFactory';

export class TagSeeds implements ISeeds {
  private async getFiveFirstOrganisation(): Promise<Organisation[]> {
    return await getRepository(Organisation).find({ take: 5 });
  }

  async run(): Promise<void> {
    const organisations = await this.getFiveFirstOrganisation();
    const tagFactory = new TagFactory(organisations);

    const tags = Factory.createMany(1000, tagFactory);

    await getConnection().manager.save(tags);
  }
}
