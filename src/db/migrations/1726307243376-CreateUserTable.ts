import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1726307243376 implements MigrationInterface {
  name = 'CreateUserTable1726307243376';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user"
       (
           "id"         SERIAL PRIMARY KEY  NOT NULL,
           "first_name" VARCHAR(255)        NOT NULL,
           "last_name"  VARCHAR(255)        NOT NULL,
           "email"      VARCHAR(255) UNIQUE NOT NULL,
           "password"   VARCHAR(255) UNIQUE NOT NULL
       )`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
