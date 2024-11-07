import { MigrationInterface, QueryRunner } from "typeorm";
import bcrypt from "bcrypt";

export class SeedAdminUser1729877358652 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const defaultUserName = process.env.DEFAULT_USER_NAME;
    const defaultPassword = process.env.DEFAULT_USER_PASSWORD;
    const defaulEmail = process.env.EMAIL_USER;

    if (!defaultUserName || !defaultPassword || !defaulEmail) {
      throw new Error(
        "Default credentials are not set in environment variables"
      );
    }

    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const existingUser = await queryRunner.query(
      `SELECT * FROM "UserSet" WHERE "username" = $1`,
      [defaultUserName]
    );

    if (existingUser.length === 0) {
      await queryRunner.query(
        `INSERT INTO "UserSet" (username, password, role, email) VALUES ($1, $2, $3, $4)`,
        [defaultUserName, hashedPassword, "admin", defaulEmail]
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const defaultUserName = process.env.DEFAULT_USER_NAME;
    if (defaultUserName) {
      await queryRunner.query(`DELETE FROM "UserSet" WHERE "username" = $1`, [
        defaultUserName,
      ]);
    }
  }
}
