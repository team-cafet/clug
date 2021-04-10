import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNameFieldInMembershipplans implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE table_name ADD name character varying');    
  }

  public async down(queryRunner: QueryRunner): Promise<void> {

  }
}
