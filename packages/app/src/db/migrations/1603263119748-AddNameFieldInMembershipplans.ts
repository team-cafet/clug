import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNameFieldInMembershipplans1603263119748
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE membership_plan ADD name character varying',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE membership_plan DROP name');
  }
}
