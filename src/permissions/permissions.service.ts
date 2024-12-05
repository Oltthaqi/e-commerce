import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}
  async create(createPermissionDto: CreatePermissionDto) {
    const permission = await this.permissionRepository.findOne({
      where: { name: createPermissionDto.name },
    });
    if (permission) {
      throw new BadRequestException('Permission already exists');
    }
    const permissionToAdd =
      this.permissionRepository.create(createPermissionDto);
    return this.permissionRepository.save(permissionToAdd);
  }

  findAll() {
    return this.permissionRepository.find();
  }

  findOne(id: number) {
    return this.permissionRepository.findOne({ where: { id } });
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    const permission = this.permissionRepository.findOne({
      where: { id },
    });
    if (!permission) {
      throw new BadRequestException('Permission not found');
    }
    return this.permissionRepository.update(id, updatePermissionDto);
  }

  async remove(id: number) {
    const permission = await this.permissionRepository.findOne({
      where: { id },
    });
    if (!permission) {
      throw new BadRequestException('Permission not found');
    }
    return this.permissionRepository.remove(permission);
  }
}
