import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1720803127473 implements MigrationInterface {
    name = 'Init1720803127473'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "PhotoSet" ("id" SERIAL NOT NULL, "photo" bytea NOT NULL, "categoriesIds" integer array NOT NULL, "location" character varying, "caption" character varying, "date" date, CONSTRAINT "PK_dd4bd5a342f83376ec1d66dac36" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "PhotoCategorySet" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_805e6aeb4c0b45c012bf0539735" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "PhotoCategorySet"`);
        await queryRunner.query(`DROP TABLE "PhotoSet"`);
    }

}
