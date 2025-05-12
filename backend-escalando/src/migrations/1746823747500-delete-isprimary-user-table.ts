import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteIsprimaryUserTable1746823747500 implements MigrationInterface {
    name = 'DeleteIsprimaryUserTable1746823747500'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "professional_patients" DROP COLUMN "isPrimary"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "professional_patients" ADD "isPrimary" boolean NOT NULL`);
    }

}
