import { MigrationInterface, QueryRunner } from 'typeorm';

export class Post1726310452415 implements MigrationInterface {
  name = 'Post1726310452415';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "post"
       (
           "id"         SERIAL PRIMARY KEY NOT NULL,
           "user_id"    INT                NOT NULL,
           "title"      VARCHAR            NOT NULL,
           "article"    VARCHAR            NOT NULL,
           "created_at" TIMESTAMP          NOT NULL
       )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "post"`);
  }
}
