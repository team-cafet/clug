import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddPersonTableAndUpdateUser1603263119749
implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "person" ("id" SERIAL NOT NULL, PRIMARY KEY ("id"), "email" character varying(254), "firstname" character varying(254), "lastname" character varying(254), "phone" character varying(50), "sexe" "user_sexe_enum" DEFAULT \'0\',  "birthdate" date, "pictureURL" character varying, "street" character varying, "streetNumber" integer, "city" character varying, "postalCode" integer, "country" character varying)'
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
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'responsiblePersonId',
        type: 'int',
        isNullable: true
      })
    );
    await queryRunner.createForeignKey(
      'user',
      new TableForeignKey({
        columnNames: ['responsiblePersonId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'person',
        onDelete: 'CASCADE',
      })
    );
    await queryRunner.query(
      'ALTER TABLE "user" DROP email, DROP firstname, DROP lastname, DROP "sexe", DROP "phone", DROP "birthdate", DROP "pictureURL", DROP "street", DROP "streetNumber", DROP "city", DROP "postalCode", DROP "country"'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "user" ADD "email" character varying(254), ADD "firstname" character varying(254), ADD "lastname" character varying(254) ,ADD "phone" character varying(50) ,ADD "sexe" "user_sexe_enum" DEFAULT \'0\', ADD "birthdate" date,ADD "pictureURL" character varying,ADD "street" character varying,ADD "streetNumber" integer,ADD "city" character varying, "postalCode" integer, ADD "country" character varying'
    );
    const userTable = await queryRunner.getTable('user');
    const foreignKey = userTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('personId') !== -1
    );
    await queryRunner.dropForeignKey(userTable, foreignKey);

    await queryRunner.dropTable('person');
  }
}
