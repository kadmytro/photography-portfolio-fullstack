import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhotoMimeType1721403760688 implements MigrationInterface {
    name = 'AddPhotoMimeType1721403760688'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PhotoSet" ADD "mimeType" character varying NOT NULL DEFAULT 'image/jpeg'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PhotoSet" DROP COLUMN "mimeType"`);
    }

}
