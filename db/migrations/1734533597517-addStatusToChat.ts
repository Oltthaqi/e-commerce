import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusToChat1734533597517 implements MigrationInterface {
    name = 'AddStatusToChat1734533597517'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`chats\` ADD \`status\` enum ('OPEN', 'CLOSE') NOT NULL DEFAULT 'OPEN'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`chats\` DROP COLUMN \`status\``);
    }

}
