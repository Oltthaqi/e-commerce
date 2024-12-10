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

      const roles = Object.values(UserRoles).map((role) => ({ name: role }));
      for (const role of roles) {
        const savedRole = await this.roleRepository.save(role);

        savedRole.permissions = rolePermissionsMapping[role.name] || [];
        await this.roleRepository.save(savedRole);
      }
    } catch (error) {
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
