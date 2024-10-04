import { MigrationInterface, QueryRunner } from "typeorm";

export class OptimizeImage21728066171891 implements MigrationInterface {
    name = 'OptimizeImage21728066171891'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PhotoSet" ALTER COLUMN "photoMobile" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "PhotoSet" ALTER COLUMN "photoBlurred" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PhotoSet" ALTER COLUMN "photoBlurred" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "PhotoSet" ALTER COLUMN "photoMobile" DROP NOT NULL`);
    }

}
