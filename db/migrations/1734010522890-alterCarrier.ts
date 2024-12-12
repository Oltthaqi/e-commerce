import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterCarrier1734010522890 implements MigrationInterface {
    name = 'AlterCarrier1734010522890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`carriers\` ADD \`username\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`carriers\` ADD \`password\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`carriers\` DROP COLUMN \`password\``);
        await queryRunner.query(`ALTER TABLE \`carriers\` DROP COLUMN \`username\``);
    }

}
