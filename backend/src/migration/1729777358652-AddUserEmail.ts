import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserEmail1729777358652 implements MigrationInterface {
  name = "AddUserEmail1729777358652";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "UserSet" ADD "email" character varying NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "UserSet" DROP COLUMN "email"`);
  }
}
