import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrdinal1726755696517 implements MigrationInterface {
    name = 'AddOrdinal1726755696517'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PhotoCategorySet" ADD "ordinal" integer`);
        await queryRunner.query(`ALTER TABLE "ServiceSet" ADD "ordinal" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ServiceSet" DROP COLUMN "ordinal"`);
        await queryRunner.query(`ALTER TABLE "PhotoCategorySet" DROP COLUMN "ordinal"`);
    }

}
