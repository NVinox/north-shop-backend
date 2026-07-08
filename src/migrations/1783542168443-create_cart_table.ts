import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCartTable1783542168443 implements MigrationInterface {
    name = 'CreateCartTable1783542168443'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cart-item" ("id" SERIAL NOT NULL, "cart_id" integer NOT NULL, "product_id" integer NOT NULL, "quantity" integer NOT NULL, "price_at_addition" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_029d76ff3d77656575deea04e5d" UNIQUE ("cart_id", "product_id"), CONSTRAINT "PK_0bab23e63a695e02f3b9496809b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cart" ("id" SERIAL NOT NULL, "user_id" integer, CONSTRAINT "REL_f091e86a234693a49084b4c2c8" UNIQUE ("user_id"), CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "cart-item" ADD CONSTRAINT "FK_a1c482ed7f51a23b6b32a125fbe" FOREIGN KEY ("cart_id") REFERENCES "cart"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart-item" ADD CONSTRAINT "FK_2a4880e1298fbd563e900f601b3" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_f091e86a234693a49084b4c2c86" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_f091e86a234693a49084b4c2c86"`);
        await queryRunner.query(`ALTER TABLE "cart-item" DROP CONSTRAINT "FK_2a4880e1298fbd563e900f601b3"`);
        await queryRunner.query(`ALTER TABLE "cart-item" DROP CONSTRAINT "FK_a1c482ed7f51a23b6b32a125fbe"`);
        await queryRunner.query(`DROP TABLE "cart"`);
        await queryRunner.query(`DROP TABLE "cart-item"`);
    }

}
