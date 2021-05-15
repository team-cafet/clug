import {MigrationInterface, QueryRunner} from 'typeorm';

export class InitialMigration1603263119746 implements MigrationInterface {
    name = 'InitialMigration1603263119746'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('CREATE TYPE "membership_plan_type_enum" AS ENUM (\'0\', \'1\', \'2\', \'3\', \'4\')');
      await queryRunner.query('CREATE TYPE "user_sexe_enum" AS ENUM (\'0\', \'1\', \'2\')');

        await queryRunner.query('CREATE TABLE "member_label" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organisationId" integer, CONSTRAINT "PK_b9251de62a400498a7a4f5f33f7" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE TABLE "organisation" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_d9428f9c8e3052d6617e3aab0ed" UNIQUE ("name"), CONSTRAINT "PK_c725ae234ef1b74cce43d2d00c1" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE TABLE "membership_plan" ("id" SERIAL NOT NULL, "price" real NOT NULL, "description" character varying, "type" "membership_plan_type_enum" NOT NULL DEFAULT \'1\', "tacit" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "clubId" integer, "organisationId" integer NOT NULL, CONSTRAINT "PK_e270c516189a3f2609c413ca451" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE TABLE "group" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_8a45300fd825918f3b40195fbdc" UNIQUE ("name"), CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE TABLE "staff" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organisationId" integer, "userId" integer, CONSTRAINT "PK_e4ee98bb552756c180aec1e854a" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying, "password" character varying, "email" character varying NOT NULL, "firstname" character varying(254), "lastname" character varying(254), "sexe" "user_sexe_enum" DEFAULT \'0\', "phone" character varying(50), "birthdate" date, "pictureURL" character varying, "street" character varying, "streetNumber" integer, "city" character varying, "postalCode" integer, "country" character varying, "settings" json, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "groupId" integer, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE TABLE "payment" ("id" SERIAL NOT NULL, "amount" real NOT NULL, "date" date NOT NULL, "hasBeenCanceled" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "memberId" integer NOT NULL, "paymentRequestId" integer, CONSTRAINT "REL_40f8d1745a86d3f687b149ce2b" UNIQUE ("paymentRequestId"), CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE TABLE "payment_request" ("id" SERIAL NOT NULL, "amount" real NOT NULL, "date" TIMESTAMP NOT NULL, "description" character varying NOT NULL, "hasBeenCanceled" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_b274a8e7b35dd0fd12e46e89f3c" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE TABLE "membership" ("id" SERIAL NOT NULL, "startDate" date NOT NULL, "endDate" date NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "memberId" integer NOT NULL, "planId" integer NOT NULL, "paymentRequestId" integer, CONSTRAINT "REL_855d85ae2a4a4272e31f3ed9df" UNIQUE ("paymentRequestId"), CONSTRAINT "PK_83c1afebef3059472e7c37e8de8" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE TABLE "member" ("id" SERIAL NOT NULL, "note" text, "balance" real NOT NULL DEFAULT 0, "customInformations" json, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organisationId" integer NOT NULL, "clubId" integer, "userId" integer NOT NULL, CONSTRAINT "PK_97cbbe986ce9d14ca5894fdc072" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE TABLE "club" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organisationId" integer, CONSTRAINT "PK_79282481e036a6e0b180afa38aa" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE TABLE "paymentrequests_members" ("paymentRequestId" integer NOT NULL, "memberId" integer NOT NULL, CONSTRAINT "PK_37bdcf1e564b3e6ce71511bb353" PRIMARY KEY ("paymentRequestId", "memberId"))');
        await queryRunner.query('CREATE INDEX "IDX_36fdeb547098018a69cb3a374e" ON "paymentrequests_members" ("paymentRequestId") ');
        await queryRunner.query('CREATE INDEX "IDX_0f07eac4c942e95e1bc0ef20b2" ON "paymentrequests_members" ("memberId") ');
        await queryRunner.query('CREATE TABLE "members_labels" ("memberId" integer NOT NULL, "memberLabelId" integer NOT NULL, CONSTRAINT "PK_c76cef457e8d95464a4bae12e1b" PRIMARY KEY ("memberId", "memberLabelId"))');
        await queryRunner.query('CREATE INDEX "IDX_46e55e4d8cd2e3c80e04ee09be" ON "members_labels" ("memberId") ');
        await queryRunner.query('CREATE INDEX "IDX_2b0cddcb22383e05517e6c46e1" ON "members_labels" ("memberLabelId") ');
        await queryRunner.query('ALTER TABLE "member_label" ADD CONSTRAINT "FK_579e4c88902aa74f53f9daf5b91" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "membership_plan" ADD CONSTRAINT "FK_62efb7ea5ffa04bd3e811ffd43b" FOREIGN KEY ("clubId") REFERENCES "club"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "membership_plan" ADD CONSTRAINT "FK_f60e52cb6c3bbfbcc533062db73" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "staff" ADD CONSTRAINT "FK_e827b9c11685b003f31a069d3bf" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "staff" ADD CONSTRAINT "FK_eba76c23bcfc9dad2479b7fd2ad" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "user" ADD CONSTRAINT "FK_974590e8d8d4ceb64e30c38e051" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "payment" ADD CONSTRAINT "FK_89ce346f102c90b97ee97a94d75" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "payment" ADD CONSTRAINT "FK_40f8d1745a86d3f687b149ce2b3" FOREIGN KEY ("paymentRequestId") REFERENCES "payment_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "membership" ADD CONSTRAINT "FK_3b4b41597707b13086e71727422" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "membership" ADD CONSTRAINT "FK_e475cfe9bc4cedda21faa674b27" FOREIGN KEY ("planId") REFERENCES "membership_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "membership" ADD CONSTRAINT "FK_855d85ae2a4a4272e31f3ed9df1" FOREIGN KEY ("paymentRequestId") REFERENCES "payment_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "member" ADD CONSTRAINT "FK_c2b06fef9ad9c2ed21706accf0e" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "member" ADD CONSTRAINT "FK_955d09117efe3a9c9cb67107fa5" FOREIGN KEY ("clubId") REFERENCES "club"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "member" ADD CONSTRAINT "FK_08897b166dee565859b7fb2fcc8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "club" ADD CONSTRAINT "FK_fb2ae2127243a73bf63453bdd9c" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "paymentrequests_members" ADD CONSTRAINT "FK_36fdeb547098018a69cb3a374ec" FOREIGN KEY ("paymentRequestId") REFERENCES "payment_request"("id") ON DELETE CASCADE ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "paymentrequests_members" ADD CONSTRAINT "FK_0f07eac4c942e95e1bc0ef20b2f" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE CASCADE ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "members_labels" ADD CONSTRAINT "FK_46e55e4d8cd2e3c80e04ee09bee" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "members_labels" ADD CONSTRAINT "FK_2b0cddcb22383e05517e6c46e12" FOREIGN KEY ("memberLabelId") REFERENCES "member_label"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE "members_labels" DROP CONSTRAINT "FK_2b0cddcb22383e05517e6c46e12"');
      await queryRunner.query('ALTER TABLE "members_labels" DROP CONSTRAINT "FK_46e55e4d8cd2e3c80e04ee09bee"');
      await queryRunner.query('ALTER TABLE "paymentrequests_members" DROP CONSTRAINT "FK_0f07eac4c942e95e1bc0ef20b2f"');
      await queryRunner.query('ALTER TABLE "paymentrequests_members" DROP CONSTRAINT "FK_36fdeb547098018a69cb3a374ec"');
      await queryRunner.query('ALTER TABLE "club" DROP CONSTRAINT "FK_fb2ae2127243a73bf63453bdd9c"');
      await queryRunner.query('ALTER TABLE "member" DROP CONSTRAINT "FK_08897b166dee565859b7fb2fcc8"');
      await queryRunner.query('ALTER TABLE "member" DROP CONSTRAINT "FK_955d09117efe3a9c9cb67107fa5"');
      await queryRunner.query('ALTER TABLE "member" DROP CONSTRAINT "FK_c2b06fef9ad9c2ed21706accf0e"');
      await queryRunner.query('ALTER TABLE "membership" DROP CONSTRAINT "FK_855d85ae2a4a4272e31f3ed9df1"');
      await queryRunner.query('ALTER TABLE "membership" DROP CONSTRAINT "FK_e475cfe9bc4cedda21faa674b27"');
      await queryRunner.query('ALTER TABLE "membership" DROP CONSTRAINT "FK_3b4b41597707b13086e71727422"');
      await queryRunner.query('ALTER TABLE "payment" DROP CONSTRAINT "FK_40f8d1745a86d3f687b149ce2b3"');
      await queryRunner.query('ALTER TABLE "payment" DROP CONSTRAINT "FK_89ce346f102c90b97ee97a94d75"');
      await queryRunner.query('ALTER TABLE "user" DROP CONSTRAINT "FK_974590e8d8d4ceb64e30c38e051"');
      await queryRunner.query('ALTER TABLE "staff" DROP CONSTRAINT "FK_eba76c23bcfc9dad2479b7fd2ad"');
      await queryRunner.query('ALTER TABLE "staff" DROP CONSTRAINT "FK_e827b9c11685b003f31a069d3bf"');
      await queryRunner.query('ALTER TABLE "membership_plan" DROP CONSTRAINT "FK_f60e52cb6c3bbfbcc533062db73"');
      await queryRunner.query('ALTER TABLE "membership_plan" DROP CONSTRAINT "FK_62efb7ea5ffa04bd3e811ffd43b"');
      await queryRunner.query('ALTER TABLE "member_label" DROP CONSTRAINT "FK_579e4c88902aa74f53f9daf5b91"');
      await queryRunner.query('DROP INDEX "IDX_2b0cddcb22383e05517e6c46e1"');
      await queryRunner.query('DROP INDEX "IDX_46e55e4d8cd2e3c80e04ee09be"');
      await queryRunner.query('DROP TABLE "members_labels"');
      await queryRunner.query('DROP INDEX "IDX_0f07eac4c942e95e1bc0ef20b2"');
      await queryRunner.query('DROP INDEX "IDX_36fdeb547098018a69cb3a374e"');
      await queryRunner.query('DROP TABLE "paymentrequests_members"');
      await queryRunner.query('DROP TABLE "club"');
      await queryRunner.query('DROP TABLE "member"');
      await queryRunner.query('DROP TABLE "membership"');
      await queryRunner.query('DROP TABLE "payment_request"');
      await queryRunner.query('DROP TABLE "payment"');
      await queryRunner.query('DROP TABLE "user"');
      await queryRunner.query('DROP TABLE "staff"');
      await queryRunner.query('DROP TABLE "group"');
      await queryRunner.query('DROP TABLE "membership_plan"');
      await queryRunner.query('DROP TABLE "organisation"');
      await queryRunner.query('DROP TABLE "member_label"');
    }

}
