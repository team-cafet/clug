import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createClubTable1581695060001 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
            new Table({
              name: "clubs",
              columns: [
                {
                  name: "id",
                  type: "bigint",
                  isPrimary: true,
                  isGenerated: true,
                  generationStrategy: "increment",
                  unsigned: true
                },
                { name: "designation", type: "varchar", isNullable: false },
                { name: "description", type: "text", isNullable: true },
              ]
            })
          );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("clubs");
    }

}
