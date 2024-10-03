import { MigrationInterface, QueryRunner } from "typeorm";

export class ContactRequestEdit1727901650513 implements MigrationInterface {
    name = 'ContactRequestEdit1727901650513'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ContactRequestSet" DROP COLUMN "isNew"`);
        await queryRunner.query(`ALTER TABLE "ContactRequestSet" ADD "isRead" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "ContactRequestSet" ADD "isArchived" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "ContactRequestSet" ADD "isDeleted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "ContactRequestSet" ADD "deletedDate" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ContactRequestSet" DROP COLUMN "deletedDate"`);
        await queryRunner.query(`ALTER TABLE "ContactRequestSet" DROP COLUMN "isDeleted"`);
        await queryRunner.query(`ALTER TABLE "ContactRequestSet" DROP COLUMN "isArchived"`);
        await queryRunner.query(`ALTER TABLE "ContactRequestSet" DROP COLUMN "isRead"`);
        await queryRunner.query(`ALTER TABLE "ContactRequestSet" ADD "isNew" boolean NOT NULL DEFAULT true`);
    }

}
