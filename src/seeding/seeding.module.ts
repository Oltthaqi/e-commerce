import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { RolesSeeder } from './RolesSeeder';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Permission]), // Import Role and Permission entities
  ],
  providers: [RolesSeeder], // Register the seeder
  exports: [RolesSeeder], // Export for use in other parts of the application
})
export class SeedingModule {}
