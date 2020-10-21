import { Group } from '../models/Group';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { EXISTING_GROUPS } from '../config/auth';

export class InitialMigrationData1601816242008 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const GROUPS_TO_CREATE = [];

    for (const groupName in EXISTING_GROUPS) {
      GROUPS_TO_CREATE.push({ name: EXISTING_GROUPS[groupName] });      
    }

    await queryRunner.manager.getRepository(Group).save(GROUPS_TO_CREATE);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'TRUNCATE TABLE "public"."group" RESTART IDENTITY CASCADE;'
    );
  }
}
