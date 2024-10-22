import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhotoCategoryRelation1729610523824 implements MigrationInterface {
    name = 'AddPhotoCategoryRelation1729610523824'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "photo_category_links" ("photoSetId" integer NOT NULL, "photoCategorySetId" integer NOT NULL, CONSTRAINT "PK_cfc51b786351fb5a10969d04826" PRIMARY KEY ("photoSetId", "photoCategorySetId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a3fa5ea59377427c09cbb453c7" ON "photo_category_links" ("photoSetId") `);
        await queryRunner.query(`CREATE INDEX "IDX_1f304c7d7145c2832951b98f1b" ON "photo_category_links" ("photoCategorySetId") `);
        await queryRunner.query(`ALTER TABLE "PhotoSet" DROP COLUMN "categoriesIds"`);
        await queryRunner.query(`ALTER TABLE "photo_category_links" ADD CONSTRAINT "FK_a3fa5ea59377427c09cbb453c7e" FOREIGN KEY ("photoSetId") REFERENCES "PhotoSet"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "photo_category_links" ADD CONSTRAINT "FK_1f304c7d7145c2832951b98f1b5" FOREIGN KEY ("photoCategorySetId") REFERENCES "PhotoCategorySet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "photo_category_links" DROP CONSTRAINT "FK_1f304c7d7145c2832951b98f1b5"`);
        await queryRunner.query(`ALTER TABLE "photo_category_links" DROP CONSTRAINT "FK_a3fa5ea59377427c09cbb453c7e"`);
        await queryRunner.query(`ALTER TABLE "PhotoSet" ADD "categoriesIds" integer array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1f304c7d7145c2832951b98f1b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a3fa5ea59377427c09cbb453c7"`);
        await queryRunner.query(`DROP TABLE "photo_category_links"`);
    }

}
