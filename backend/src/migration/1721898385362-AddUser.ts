import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUser1721898385362 implements MigrationInterface {
    name = 'AddUser1721898385362'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "UserSet" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL, CONSTRAINT "UQ_894a33e2ac9b7d19125a42f9cf5" UNIQUE ("username"), CONSTRAINT "PK_ab742610459a4df0b92b765b554" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "UserSet"`);
    }

}
