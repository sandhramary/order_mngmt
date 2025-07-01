import { MigrationInterface, QueryRunner } from "typeorm";

export class OrderType1751352373326 implements MigrationInterface {
    name = 'OrderType1751352373326'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ADD "orderType" character varying NOT NULL DEFAULT 'cart'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "orderType"`);
    }

}
