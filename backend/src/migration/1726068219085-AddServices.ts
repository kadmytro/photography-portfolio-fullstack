import { MigrationInterface, QueryRunner } from "typeorm";

export class AddServices1726068219085 implements MigrationInterface {
    name = 'AddServices1726068219085'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ServiceSet" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "price" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "image" bytea NOT NULL, CONSTRAINT "PK_e2ebec75ab9e8f80282358633d7" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "ServiceSet"`);
    }

}
