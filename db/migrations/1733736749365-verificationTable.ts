import { MigrationInterface, QueryRunner } from 'typeorm';

export class VerificationTable1733736749365 implements MigrationInterface {
  name = 'VerificationTable1733736749365';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`verification\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`token\` varchar(255) NOT NULL, \`expiresAt\` datetime NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`emailVerifiedAt\` datetime NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`isVerified\` tinyint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product\` CHANGE \`status\` \`status\` varchar(255) NOT NULL DEFAULT 'ACTIVE'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`verification\` ADD CONSTRAINT \`FK_8300048608d8721aea27747b07a\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`verification\` DROP FOREIGN KEY \`FK_8300048608d8721aea27747b07a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product\` CHANGE \`status\` \`status\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`isVerified\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP COLUMN \`emailVerifiedAt\``,
    );
    await queryRunner.query(`DROP TABLE \`verification\``);
  }
}
