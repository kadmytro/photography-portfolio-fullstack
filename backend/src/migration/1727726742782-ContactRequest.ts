import { MigrationInterface, QueryRunner } from "typeorm";

export class ContactRequest1727726742782 implements MigrationInterface {
    name = 'ContactRequest1727726742782'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ContactRequestSet" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "subject" character varying NOT NULL, "message" text NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), "isNew" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_a616a9b1b10cec4823337a0e8d2" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "ContactRequestSet"`);
    }

}
