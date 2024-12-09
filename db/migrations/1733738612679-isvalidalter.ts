import { MigrationInterface, QueryRunner } from 'typeorm';

export class Isvalidalter1733738612679 implements MigrationInterface {
  name = 'Isvalidalter1733738612679';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`isVerified\` \`isVerified\` tinyint NOT NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`isVerified\` \`isVerified\` tinyint NOT NULL`,
    );
  }
}
