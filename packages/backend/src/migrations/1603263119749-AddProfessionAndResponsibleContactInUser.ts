import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProfessionAndResponsibleContactInUser1603263119749
implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "user" ADD profession character varying'
    );
    await queryRunner.query(
      'ALTER TABLE "user" ADD responsible_name character varying'
    );
    await queryRunner.query(
      'ALTER TABLE "user" ADD responsible_phone character varying(50)'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user" DROP name');
    await queryRunner.query('ALTER TABLE "user" DROP responsible_name');
    await queryRunner.query('ALTER TABLE "user" DROP responsible_phone');
  }
}
