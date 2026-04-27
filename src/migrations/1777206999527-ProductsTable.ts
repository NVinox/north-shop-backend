import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductsTable1777206999527 implements MigrationInterface {
    name = 'ProductsTable1777206999527'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "price" integer NOT NULL, "old_price" integer, "discount" integer NOT NULL DEFAULT '0', "sku" character varying(255) NOT NULL, "rating_avg" numeric(3,1) NOT NULL DEFAULT '0', "review_count" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c44ac33a05b144dd0d9ddcf9327" UNIQUE ("sku"), CONSTRAINT "CHK_7bef9936e259a3169d8bb8102d" CHECK ("discount" >= 0 AND "discount" <= 100), CONSTRAINT "CHK_d94386f4876cbd45bcb91725cb" CHECK ("review_count" >= 0), CONSTRAINT "CHK_a535da5e992caae5b2eb45ded6" CHECK ("old_price" >= 0), CONSTRAINT "CHK_4f89fdb25537b37409d3b781c8" CHECK ("price" >= 0), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "products"`);
    }

}
