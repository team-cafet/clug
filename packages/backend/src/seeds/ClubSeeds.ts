import { Organisation } from '../models/Organisation';
import { getRepository } from 'typeorm';
import { Factory } from '../libs/classes/Factory';
import { ISeeds } from '../libs/interfaces/ISeeds';
import { ClubFactory } from './factory/ClubFactory';

export class ClubSeeds implements ISeeds {
  private async getFiveFirstOrganisation(): Promise<Organisation[]> {
    return await getRepository(Organisation).find({ take: 5 });
  }

  async run(): Promise<void> {
    const organisations = await this.getFiveFirstOrganisation();
    const clubFactory = new ClubFactory(organisations);

    const clubs = Factory.createMany(Number.parseInt(process.env.SEEDS_NB_CLUB) ?? 20, clubFactory);

    await Promise.all(clubs.map(async (club) => club.save()));
  }
}
