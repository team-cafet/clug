import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddPersonTableAndUpdateUser1603263119749
implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "person" ("id" SERIAL NOT NULL, "email" character varying(254), "firstname" character varying(254), "lastname" character varying(254), "phone" character varying(50), PRIMARY KEY ("id"))'
    );
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'personId',
        type: 'int',
      })
    );
    await queryRunner.createForeignKey(
      'user',
      new TableForeignKey({
        columnNames: ['personId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'person',
        onDelete: 'CASCADE',
      })
    );
    await queryRunner.query(
      'ALTER TABLE "user" DROP email, DROP firstname, DROP lastname, DROP phone'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "user" ADD "email" character varying(254), ADD "firstname" character varying(254), ADD "lastname" character varying(254), ADD "phone" character varying(50)'
    );
    const userTable = await queryRunner.getTable('user');
    const foreignKey = userTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('questionId') !== -1
    );
    await queryRunner.dropForeignKey(userTable, foreignKey);

    await queryRunner.dropTable('person');
  }
}
