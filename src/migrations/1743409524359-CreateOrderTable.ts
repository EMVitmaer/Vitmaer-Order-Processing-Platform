import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrderTable1743409524359 implements MigrationInterface {
  name = 'CreateOrderTable1743409524359';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."order_payment_type_enum" AS ENUM('cash', 'card', 'transfer')
    `);
    await queryRunner.query(`
      CREATE TABLE "order" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL, 
        "price" integer NOT NULL, 
        "paymentType" "public"."order_payment_type_enum" NOT NULL DEFAULT 'card', 
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_order_table" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "order"');
    await queryRunner.query('DROP TYPE "public"."order_payment_type_enum"');
  }
}
