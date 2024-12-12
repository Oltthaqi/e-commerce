import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCarrierTable1733997212379 implements MigrationInterface {
  name = 'AddCarrierTable1733997212379';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`carriers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD \`code\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`order\` ADD \`carrierId\` int NULL`);
    await queryRunner.query(
      `ALTER TABLE \`permission\` CHANGE \`description\` \`description\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD CONSTRAINT \`FK_3180b06102e839c44f77f7358cb\` FOREIGN KEY (\`carrierId\`) REFERENCES \`carriers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_3180b06102e839c44f77f7358cb\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`permission\` CHANGE \`description\` \`description\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`carrierId\``);
    await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`code\``);
    await queryRunner.query(`DROP TABLE \`carriers\``);
  }
}
