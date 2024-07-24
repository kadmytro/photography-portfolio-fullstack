import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhotoDimensions1721308625376 implements MigrationInterface {
    name = 'AddPhotoDimensions1721308625376'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PhotoSet" ADD "height" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "PhotoSet" ADD "width" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PhotoSet" DROP COLUMN "width"`);
        await queryRunner.query(`ALTER TABLE "PhotoSet" DROP COLUMN "height"`);
    }

}
