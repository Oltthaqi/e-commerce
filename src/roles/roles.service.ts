import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { Permission } from 'src/permissions/entities/permission.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(createRoleDto: CreateRoleDto) {
    const role = await this.roleRepository.findOne({
      where: { name: createRoleDto.name },
    });
    if (role) {
      throw new BadRequestException('Role already exists');
    }
    const roleToAdd = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(roleToAdd);
  }

  async givePermissionToRole(roleId: number, permissionId: number[]) {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });

    if (!role) {
      throw new BadRequestException('Role not found');
    }
    const permissions = await this.permissionRepository.findByIds(permissionId);

    if (!permissions) {
      throw new BadRequestException('Permission not found');
    }
    role.permissions = [
      ...role.permissions,
      ...permissions.filter(
        (permission) =>
          !role.permissions.some(
            (existingPermission) => existingPermission.id === permission.id,
          ),
      ),
    ];
    return this.roleRepository.save(role);
  }

  async removePermission(roleId: number, permissionId: number[]) {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });

    if (!role) {
      throw new BadRequestException('Role not found');
    }
    if (role.name === 'admin') {
      throw new BadRequestException(
        'Permission cannot be removed from admin role',
      );
    }

    role.permissions = role.permissions.filter(
      (existingPermission) => !permissionId.includes(existingPermission.id),
    );
    return this.roleRepository.save(role);
  }

  async roleAsign(userId: number, roleId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });
    if (!role) {
      throw new BadRequestException('Role not found');
    }

    user.roles = [role];
    return this.userRepository.save(user);
  }
  findAll() {
    return `This action returns all roles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new BadRequestException('Role not found');
    }
    return this.roleRepository.update(id, updateRoleDto);
  }

  async remove(id: number) {
    const role = await this.roleRepository.findOne({ where: { id } });
    return this.roleRepository.remove(role);
  }
}
