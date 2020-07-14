import {MigrationInterface, QueryRunner} from "typeorm";

export class DBClugV11594735894978 implements MigrationInterface {
    name = 'DBClugV11594735894978'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "club" ("id" SERIAL NOT NULL, "designation" character varying NOT NULL, "description" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_faef3baddf4928b71e87fe72772" UNIQUE ("designation"), CONSTRAINT "PK_79282481e036a6e0b180afa38aa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "membership_plan_typeoffacturation_enum" AS ENUM('0', '1', '2', '3', '4')`);
        await queryRunner.query(`CREATE TABLE "membership_plan" ("id" SERIAL NOT NULL, "designation" character varying(30) NOT NULL, "description" text, "amount" real NOT NULL, "typeOfFacturation" "membership_plan_typeoffacturation_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_28983e945c86f9ad8bdce5c6fa0" UNIQUE ("designation"), CONSTRAINT "PK_e270c516189a3f2609c413ca451" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "membership" ("id" SERIAL NOT NULL, "startDate" date NOT NULL, "endDate" date, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "memberId" integer NOT NULL, "membershipPlanId" integer NOT NULL, CONSTRAINT "PK_83c1afebef3059472e7c37e8de8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "level" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_d3f1a7a6f09f1c3144bacdc6bcc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "member_sexe_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TYPE "member_financialstatus_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TABLE "member" ("id" SERIAL NOT NULL, "firstname" character varying(254) NOT NULL, "lastname" character varying(254) NOT NULL, "sexe" "member_sexe_enum" DEFAULT '0', "email" character varying(254) NOT NULL, "phone" character varying(50), "birthdate" date, "financialStatus" "member_financialstatus_enum" DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "clubId" integer, "levelId" integer, "addressId" integer, CONSTRAINT "UQ_4678079964ab375b2b31849456c" UNIQUE ("email"), CONSTRAINT "REL_813c7d0f53916afbd1624c4e30" UNIQUE ("addressId"), CONSTRAINT "PK_97cbbe986ce9d14ca5894fdc072" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "address" ("id" SERIAL NOT NULL, "street" character varying NOT NULL, "streetNumber" integer NOT NULL, "city" character varying NOT NULL, "postalCode" integer NOT NULL, "country" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permission" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "codeName" character varying(100) NOT NULL, CONSTRAINT "UQ_390215abbc2901e2e623a69a03c" UNIQUE ("codeName"), CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "group" ("id" SERIAL NOT NULL, "name" character varying(80) NOT NULL, "codeName" character varying(100) NOT NULL, CONSTRAINT "UQ_c13ca26406d3e9be800054b9a4c" UNIQUE ("codeName"), CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "group_permissions_permission" ("groupId" integer NOT NULL, "permissionId" integer NOT NULL, CONSTRAINT "PK_d9b4ec30d48ed8515908f47f691" PRIMARY KEY ("groupId", "permissionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_24022d7e409de3835f25603d35" ON "group_permissions_permission" ("groupId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0777702b851f7662e2678b4568" ON "group_permissions_permission" ("permissionId") `);
        await queryRunner.query(`CREATE TABLE "user_groups_group" ("userId" integer NOT NULL, "groupId" integer NOT NULL, CONSTRAINT "PK_98d481413dbe5578ad2a45ab863" PRIMARY KEY ("userId", "groupId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_84ff6a520aee2bf2512c01cf46" ON "user_groups_group" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8abdfe8f9d78a4f5e821dbf620" ON "user_groups_group" ("groupId") `);
        await queryRunner.query(`CREATE TABLE "user_user_permissions_permission" ("userId" integer NOT NULL, "permissionId" integer NOT NULL, CONSTRAINT "PK_bf95d80e2b8e8d17c2b598a7a0e" PRIMARY KEY ("userId", "permissionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4c3462965c06c5bc3c8996f452" ON "user_user_permissions_permission" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4a38ad03e94f4de594fc09fb53" ON "user_user_permissions_permission" ("permissionId") `);
        await queryRunner.query(`ALTER TABLE "membership" ADD CONSTRAINT "FK_3b4b41597707b13086e71727422" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "membership" ADD CONSTRAINT "FK_22187f2e2d74734bf22855c92b5" FOREIGN KEY ("membershipPlanId") REFERENCES "membership_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "member" ADD CONSTRAINT "FK_955d09117efe3a9c9cb67107fa5" FOREIGN KEY ("clubId") REFERENCES "club"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "member" ADD CONSTRAINT "FK_d7df11231cdce5fc75c0ea50c64" FOREIGN KEY ("levelId") REFERENCES "level"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "member" ADD CONSTRAINT "FK_813c7d0f53916afbd1624c4e304" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_permissions_permission" ADD CONSTRAINT "FK_24022d7e409de3835f25603d35d" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_permissions_permission" ADD CONSTRAINT "FK_0777702b851f7662e2678b45689" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_groups_group" ADD CONSTRAINT "FK_84ff6a520aee2bf2512c01cf462" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_groups_group" ADD CONSTRAINT "FK_8abdfe8f9d78a4f5e821dbf6203" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_user_permissions_permission" ADD CONSTRAINT "FK_4c3462965c06c5bc3c8996f4524" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_user_permissions_permission" ADD CONSTRAINT "FK_4a38ad03e94f4de594fc09fb53c" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_user_permissions_permission" DROP CONSTRAINT "FK_4a38ad03e94f4de594fc09fb53c"`);
        await queryRunner.query(`ALTER TABLE "user_user_permissions_permission" DROP CONSTRAINT "FK_4c3462965c06c5bc3c8996f4524"`);
        await queryRunner.query(`ALTER TABLE "user_groups_group" DROP CONSTRAINT "FK_8abdfe8f9d78a4f5e821dbf6203"`);
        await queryRunner.query(`ALTER TABLE "user_groups_group" DROP CONSTRAINT "FK_84ff6a520aee2bf2512c01cf462"`);
        await queryRunner.query(`ALTER TABLE "group_permissions_permission" DROP CONSTRAINT "FK_0777702b851f7662e2678b45689"`);
        await queryRunner.query(`ALTER TABLE "group_permissions_permission" DROP CONSTRAINT "FK_24022d7e409de3835f25603d35d"`);
        await queryRunner.query(`ALTER TABLE "member" DROP CONSTRAINT "FK_813c7d0f53916afbd1624c4e304"`);
        await queryRunner.query(`ALTER TABLE "member" DROP CONSTRAINT "FK_d7df11231cdce5fc75c0ea50c64"`);
        await queryRunner.query(`ALTER TABLE "member" DROP CONSTRAINT "FK_955d09117efe3a9c9cb67107fa5"`);
        await queryRunner.query(`ALTER TABLE "membership" DROP CONSTRAINT "FK_22187f2e2d74734bf22855c92b5"`);
        await queryRunner.query(`ALTER TABLE "membership" DROP CONSTRAINT "FK_3b4b41597707b13086e71727422"`);
        await queryRunner.query(`DROP INDEX "IDX_4a38ad03e94f4de594fc09fb53"`);
        await queryRunner.query(`DROP INDEX "IDX_4c3462965c06c5bc3c8996f452"`);
        await queryRunner.query(`DROP TABLE "user_user_permissions_permission"`);
        await queryRunner.query(`DROP INDEX "IDX_8abdfe8f9d78a4f5e821dbf620"`);
        await queryRunner.query(`DROP INDEX "IDX_84ff6a520aee2bf2512c01cf46"`);
        await queryRunner.query(`DROP TABLE "user_groups_group"`);
        await queryRunner.query(`DROP INDEX "IDX_0777702b851f7662e2678b4568"`);
        await queryRunner.query(`DROP INDEX "IDX_24022d7e409de3835f25603d35"`);
        await queryRunner.query(`DROP TABLE "group_permissions_permission"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "group"`);
        await queryRunner.query(`DROP TABLE "permission"`);
        await queryRunner.query(`DROP TABLE "address"`);
        await queryRunner.query(`DROP TABLE "member"`);
        await queryRunner.query(`DROP TYPE "member_financialstatus_enum"`);
        await queryRunner.query(`DROP TYPE "member_sexe_enum"`);
        await queryRunner.query(`DROP TABLE "level"`);
        await queryRunner.query(`DROP TABLE "membership"`);
        await queryRunner.query(`DROP TABLE "membership_plan"`);
        await queryRunner.query(`DROP TYPE "membership_plan_typeoffacturation_enum"`);
        await queryRunner.query(`DROP TABLE "club"`);
    }

}
