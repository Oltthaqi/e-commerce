import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { UserRoles } from '../roles/enum/roles.enum';
import {
  PermissionDescriptions,
  UserPermissions,
} from '../permissions/enum/User-Permissions.enum';

@Injectable()
export class RolesSeeder {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async seed() {
    const queryRunner =
      this.roleRepository.manager.connection.createQueryRunner();

    try {
      // Disable foreign key checks
      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0;');

      // Truncate the user_roles table (pivot table)
      await queryRunner.query('TRUNCATE TABLE `user_roles`;');

      // Truncate the roles table
      await queryRunner.query('TRUNCATE TABLE `role`;');

      // Truncate the permissions table
      await queryRunner.query('TRUNCATE TABLE `permission`;');

      // Re-enable foreign key checks
      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1;');

      console.log('Truncated user_roles, roles, and permissions tables.');

      // Seed permissions
      const permissions = Object.values(UserPermissions).map((permission) => ({
        name: permission,
        description:
          PermissionDescriptions[permission] || 'No description provided',
      }));
      const savedPermissions = [];
      for (const permission of permissions) {
        const savedPermission =
          await this.permissionRepository.save(permission);
        savedPermissions.push(savedPermission);
      }

      // Map roles to permissions
      const rolePermissionsMapping = {
        [UserRoles.ADMIN]: [...savedPermissions],
        [UserRoles.MANAGER]: savedPermissions.filter((p) =>
          [
            UserPermissions.ORDERS_GET,
            UserPermissions.ORDERS_EDIT,
            UserPermissions.ORDERS_DELETE,
            UserPermissions.ORDERS_REFUND,
            UserPermissions.ORDERS_RETURN,
            UserPermissions.PRODUCTS_GET,
            UserPermissions.PRODUCTS_CREATE,
            UserPermissions.PRODUCTS_EDIT,
            UserPermissions.PRODUCTS_DELETE,
            UserPermissions.CATEGORIES_GET,
            UserPermissions.CATEGORIES_CREATE,
            UserPermissions.CATEGORIES_EDIT,
            UserPermissions.CATEGORIES_DELETE,
            UserPermissions.SHIPPING_GET,
            UserPermissions.SHIPPING_CREATE,
            UserPermissions.SHIPPING_EDIT,
            UserPermissions.SHIPPING_DELETE,
          ].includes(p.name),
        ),
        [UserRoles.VENDOR]: savedPermissions.filter((p) =>
          [
            UserPermissions.ORDERS_GET_OWN,
            UserPermissions.ORDERS_CREATE,
            UserPermissions.ORDERS_EDIT,
            UserPermissions.PRODUCTS_GET,
            UserPermissions.PRODUCTS_CREATE,
            UserPermissions.PRODUCTS_EDIT,
            UserPermissions.PRODUCTS_DELETE,
            UserPermissions.SHIPPING_GET_OWN,
          ].includes(p.name),
        ),
        [UserRoles.CUSTOMER]: savedPermissions.filter((p) =>
          [
            UserPermissions.ORDERS_GET_OWN,
            UserPermissions.ORDERS_CREATE,
            UserPermissions.PRODUCTS_GET,
            UserPermissions.SHIPPING_GET_OWN,
          ].includes(p.name),
        ),
        [UserRoles.SHIPPING_AGENT]: savedPermissions.filter((p) =>
          [
            UserPermissions.SHIPPING_GET,
            UserPermissions.SHIPPING_CREATE,
            UserPermissions.SHIPPING_EDIT,
            UserPermissions.SHIPPING_DELETE,
          ].includes(p.name),
        ),
      };

      // Seed roles and assign permissions
      const roles = Object.values(UserRoles).map((role) => ({ name: role }));
      for (const role of roles) {
        const savedRole = await this.roleRepository.save(role);

        // Assign permissions to the role
        savedRole.permissions = rolePermissionsMapping[role.name] || [];
        await this.roleRepository.save(savedRole);
      }

      console.log('Seeding roles and permissions complete!');
    } catch (error) {
      console.error('Error during seeding:', error);
    } finally {
      await queryRunner.release();
    }
  }
}
