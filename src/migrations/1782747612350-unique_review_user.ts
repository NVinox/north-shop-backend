import { MigrationInterface, QueryRunner } from "typeorm";

export class UniqueReviewUser1782747612350 implements MigrationInterface {
    name = 'UniqueReviewUser1782747612350'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "UQ_43968e5855f331f4f1355a3fb27" UNIQUE ("user_id", "product_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "UQ_43968e5855f331f4f1355a3fb27"`);
    }

}
