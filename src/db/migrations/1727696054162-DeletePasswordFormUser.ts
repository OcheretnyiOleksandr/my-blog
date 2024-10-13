import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeletePasswordFormUser1727696054162 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user"
        DROP COLUMN "password"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "password" VARCHAR(512) UNIQUE`,
    );
  }
}
