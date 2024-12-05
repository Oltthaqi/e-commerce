import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async getUserRoles(userId: number): Promise<any[]> {
    return this.userRepo
      .createQueryBuilder('user')
      .innerJoin('user_roles', 'ur', 'ur.user_Id = user.id')
      .innerJoin('role', 'role', 'role.id = ur.role_Id')
      .where('user.id = :userId', { userId })
      .select(['role.id', 'role.name'])
      .getRawMany();
  }

  async getUserPermissions(userId: number): Promise<any[]> {
    const rawPermissions = await this.userRepo
      .createQueryBuilder('user')
      .innerJoin('user_roles', 'ur', 'ur.user_Id = user.id')
      .innerJoin('role', 'role', 'role.id = ur.role_Id')
      .innerJoin('role_permissions', 'rp', 'rp.role_Id = role.id')
      .innerJoin('permission', 'permission', 'permission.id = rp.permission_Id')
      .where('user.id = :userId', { userId })
      .select([
        'permission.id AS permissionId',
        'permission.name AS permissionName',
      ])
      .getRawMany();

    return rawPermissions.map((permission) => ({
      id: permission.permissionId,
      name: permission.permissionName,
    }));
  }
  create(createUserDto: CreateUserDto) {
    const user = this.userRepo.findOne({
      where: { email: createUserDto.email },
    });
    if (user) {
      throw new BadRequestException('User already exists');
    }
    const userToCreate = this.userRepo.create(createUserDto);
    return this.userRepo.save(userToCreate);
  }

  findAll() {
    return this.userRepo.find({ relations: ['roles', 'roles.permissions'] });
  }

  findOne(id: number) {
    return this.userRepo.findOne({ where: { id } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const user = this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return this.userRepo.update(id, updateUserDto);
  }

  async remove(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return this.userRepo.remove(user);
  }
}
