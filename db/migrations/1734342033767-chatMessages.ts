import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChatMessages1734342033767 implements MigrationInterface {
  name = 'ChatMessages1734342033767';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`chats\` (\`id\` int NOT NULL AUTO_INCREMENT, \`roomId\` int NULL, \`message\` text NOT NULL, \`created_At\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`senderId\` int NULL, \`receiverId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`chats\` ADD CONSTRAINT \`FK_d697f19c9c7778ed773b449ce70\` FOREIGN KEY (\`senderId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`chats\` ADD CONSTRAINT \`FK_c8562e07e5260b76b37e25126c6\` FOREIGN KEY (\`receiverId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`chats\` DROP FOREIGN KEY \`FK_c8562e07e5260b76b37e25126c6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`chats\` DROP FOREIGN KEY \`FK_d697f19c9c7778ed773b449ce70\``,
    );
    await queryRunner.query(`DROP TABLE \`chats\``);
  }
}
