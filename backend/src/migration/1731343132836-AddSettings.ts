import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSettings1731343132836 implements MigrationInterface {
    name = 'AddSettings1731343132836'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "SettingSet" ("id" SERIAL NOT NULL, "key" character varying NOT NULL, "value" jsonb NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_f844761eb0809735e7352fcf0e6" UNIQUE ("key"), CONSTRAINT "PK_516dbff1751fe820b7f6e3d67a5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "UserSet" ALTER COLUMN "email" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "UserSet" ALTER COLUMN "email" SET DEFAULT 'blank'`);
        await queryRunner.query(`DROP TABLE "SettingSet"`);
    }

}
