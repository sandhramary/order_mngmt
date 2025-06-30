import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedUser1751281183194 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
                INSERT INTO "user" ("name", "emailId", "password") VALUES
                ('John Doe', 'johndoe@gmail.com', 'password123')
                `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
