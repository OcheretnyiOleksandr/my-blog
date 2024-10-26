import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableLike1729419478429 implements MigrationInterface {
  name = 'CreateTableLike1729419478429';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "like"
       (
           "id"      SERIAL PRIMARY KEY,
           "user_id" INT NOT NULL REFERENCES "user" (id) ON DELETE CASCADE,
           "post_id" INT NOT NULL REFERENCES "post" ("id") ON DELETE CASCADE,
           CONSTRAINT unique_like UNIQUE (user_id, post_id)
       )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "like"`);
  }
}
