import { MigrationInterface, QueryRunner } from "typeorm";

export class OptimizeImage1728060471818 implements MigrationInterface {
    name = 'OptimizeImage1728060471818'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PhotoSet" ADD "photoMobile" bytea`);
        await queryRunner.query(`ALTER TABLE "PhotoSet" ADD "photoBlurred" bytea`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PhotoSet" DROP COLUMN "photoBlurred"`);
        await queryRunner.query(`ALTER TABLE "PhotoSet" DROP COLUMN "photoMobile"`);
    }

}
