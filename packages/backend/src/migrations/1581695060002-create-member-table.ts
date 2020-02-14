import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey
} from "typeorm";

export class createMemberTable1581695060002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "member",
        columns: [
          {
            name: "id",
            type: "bigint",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
            unsigned: true
          },
          { name: "name", type: "varchar", isNullable: false },
          { name: "surname", type: "varchar", isNullable: false },
          { name: "email", type: "varchar", isNullable: false },
          { name: "sexe", type: "varchar", isNullable: false },
          { name: "phone", type: "varchar", isNullable: false },
          { name: "birthdate", type: "Date", isNullable: true },
          { name: "finacialStatus", type: "Date", isNullable: false },
          { name: "createdAt", type: "Date" },
          { name: "updatedAt", type: "Date" },
          { name: "deletedAt", type: "Date" },
          { name: "club_id", type: "bigint", isPrimary: true, unsigned: true }
        ]
      })
    );
    await queryRunner.createForeignKey(
      "member",
      new TableForeignKey({
        columnNames: ["club_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "club",
        onDelete: "CASCADE"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const table = await queryRunner.getTable("member");

    let foreignKey = table!.foreignKeys.find(
      fk => fk.columnNames.indexOf("genre_id") !== -1
    );
    await queryRunner.dropForeignKey("films", foreignKey!);

    foreignKey = table!.foreignKeys.find(
      fk => fk.columnNames.indexOf("type_id") !== -1
    );
    await queryRunner.dropForeignKey("films", foreignKey!);

    await queryRunner.dropTable("films");
  }
}
