import { MigrationInterface, QueryRunner } from 'typeorm';

export class Comment1726310668858 implements MigrationInterface {
  name = 'Comment1726310668858';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "comment"
       (
           "id"         SERIAL PRIMARY KEY,
           "user_id"    INT       NOT NULL,
           "post_id"    INT       NOT NULL REFERENCES post ("id") ON DELETE CASCADE,
           "comment"    VARCHAR   NOT NULL,
           "created_at" TIMESTAMP NOT NULL
       )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "comment"`);
  }
}
