import { MigrationInterface, QueryRunner } from "typeorm";

export class NullableMobileImage1731937039429 implements MigrationInterface {
    name = 'NullableMobileImage1731937039429'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PhotoSet" ALTER COLUMN "photoMobile" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "PhotoSet" ALTER COLUMN "photoBlurred" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PhotoSet" ALTER COLUMN "photoBlurred" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "PhotoSet" ALTER COLUMN "photoMobile" SET NOT NULL`);
    }

}
