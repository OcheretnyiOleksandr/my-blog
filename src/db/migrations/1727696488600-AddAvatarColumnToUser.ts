import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAvatarColumnToUser1727696488600 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user"
        ADD COLUMN avatar_url VARCHAR;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user"
        ADD "avatar_url" VARCHAR(512) UNIQUE`);
  }
}
