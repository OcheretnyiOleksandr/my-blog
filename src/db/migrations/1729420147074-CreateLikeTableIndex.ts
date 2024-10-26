import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLikeTableIndex1729420147074 implements MigrationInterface {
  name = 'CreateLikeTableIndex1729420147074';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX idx_likes_user_post ON "like" (user_id, post_id)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "idx_likes_user_post"`);
  }
}
