import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductSlugColumn1784894159899 implements MigrationInterface {
  name = 'CreateProductSlugColumn1784894159899';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" ADD "slug" character varying(255)`,
    );
    await queryRunner.query(`
        UPDATE "products" 
        SET "slug" = lower(
            regexp_replace(
                regexp_replace("title", '[^a-zA-Z0-9а-яА-Я\s]', '', 'g'),
                '\s+', '-', 'g'
            )
        ) || '-' || CAST("sku" AS text)
    `);
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "slug" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "UQ_464f927ae360106b783ed0b4106" UNIQUE ("slug")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "UQ_464f927ae360106b783ed0b4106"`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "slug"`);
  }
}
