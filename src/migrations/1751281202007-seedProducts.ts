import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedProducts1751281202007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
                INSERT INTO "product" ("name", "description", "price", "stock") VALUES
                 ('T-Shirt', 'Soft cotton T-shirt', 499, 100),
                 ('Jeans', 'Blue denim jeans', 999, 50),
                 ('Jacket', 'Winter jacket', 1499, 30),
                 ('Bluetooth Headphones', 'Wireless headphones', 1299, 10),
                 ('Running Shoes', 'Lightweight running shoes', 1999, 12);
                `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "product";
            `);
  }
}
