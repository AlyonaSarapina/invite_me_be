import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1744052902716 implements MigrationInterface {
    name = 'InitMigration1744052902716'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "bookings"."booking_status_enum" AS ENUM('confirmed', 'canceled', 'completed')`);
        await queryRunner.query(`CREATE TABLE "bookings"."booking" ("id" SERIAL NOT NULL, "num_people" integer NOT NULL, "start_time" TIMESTAMP WITH TIME ZONE NOT NULL, "end_time" TIMESTAMP WITH TIME ZONE NOT NULL, "status" "bookings"."booking_status_enum" NOT NULL, "created_at" TIME WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIME WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIME WITH TIME ZONE, "client_id" integer, CONSTRAINT "PK_49171efc69702ed84c812f33540" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "restautants"."table" ("id" SERIAL NOT NULL, "table_number" integer NOT NULL, "table_capacity" integer NOT NULL, "created_at" TIME WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIME WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIME WITH TIME ZONE, "restaurant_id" integer, CONSTRAINT "PK_28914b55c485fc2d7a101b1b2a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1e79a861b6be1078a6b79e48ff" ON "restautants"."table" ("restaurant_id") `);
        await queryRunner.query(`CREATE TABLE "restaurants"."restaurant" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "address" character varying NOT NULL, "email" character varying NOT NULL, "operating_hours" json NOT NULL, "booking_duration" integer NOT NULL, "tables_capacity" integer NOT NULL, "cuisine" character varying NOT NULL, "logo_url" character varying, "menu_url" character varying, "phone" character varying NOT NULL, "inst_url" character varying NOT NULL, "rating" numeric(3,2) NOT NULL, "is_pet_friedly" boolean NOT NULL, "created_at" TIME WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIME WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIME WITH TIME ZONE, "owner_id" integer, CONSTRAINT "UQ_d055cac5f0f06d57b0a3b1fe574" UNIQUE ("email"), CONSTRAINT "PK_649e250d8b8165cb406d99aa30f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fe7a22ecf454b7168b5a37fbdc" ON "restaurants"."restaurant" ("owner_id") `);
        await queryRunner.query(`CREATE TYPE "users"."user_role_enum" AS ENUM('client', 'owner')`);
        await queryRunner.query(`CREATE TABLE "users"."user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "phone" character varying NOT NULL, "date_of_birth" date, "profile_pic_url" character varying, "role" "users"."user_role_enum" NOT NULL, "created_at" TIME WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIME WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIME WITH TIME ZONE, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "users"."user" ("email") `);
        await queryRunner.query(`ALTER TABLE "bookings"."booking" ADD CONSTRAINT "FK_65f5f7fdebd59a3289ee2f77b73" FOREIGN KEY ("client_id") REFERENCES "users"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "restautants"."table" ADD CONSTRAINT "FK_1e79a861b6be1078a6b79e48ff9" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"."restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "restaurants"."restaurant" ADD CONSTRAINT "FK_fe7a22ecf454b7168b5a37fbdce" FOREIGN KEY ("owner_id") REFERENCES "users"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurants"."restaurant" DROP CONSTRAINT "FK_fe7a22ecf454b7168b5a37fbdce"`);
        await queryRunner.query(`ALTER TABLE "restautants"."table" DROP CONSTRAINT "FK_1e79a861b6be1078a6b79e48ff9"`);
        await queryRunner.query(`ALTER TABLE "bookings"."booking" DROP CONSTRAINT "FK_65f5f7fdebd59a3289ee2f77b73"`);
        await queryRunner.query(`DROP INDEX "users"."IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`DROP TABLE "users"."user"`);
        await queryRunner.query(`DROP TYPE "users"."user_role_enum"`);
        await queryRunner.query(`DROP INDEX "restaurants"."IDX_fe7a22ecf454b7168b5a37fbdc"`);
        await queryRunner.query(`DROP TABLE "restaurants"."restaurant"`);
        await queryRunner.query(`DROP INDEX "restautants"."IDX_1e79a861b6be1078a6b79e48ff"`);
        await queryRunner.query(`DROP TABLE "restautants"."table"`);
        await queryRunner.query(`DROP TABLE "bookings"."booking"`);
        await queryRunner.query(`DROP TYPE "bookings"."booking_status_enum"`);
    }

}
