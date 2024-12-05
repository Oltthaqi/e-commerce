import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RegisterUsersDto } from './dto/register-User.dto';
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const roles = await this.userService.getUserRoles(user.id);
    const permissions = await this.userService.getUserPermissions(user.id);

    const payload = {
      sub: user.id,
      username: user.username,
      roles: roles.map((role) => role.role_name),
      permissions: permissions.map((permission) => permission.name),
    };
    console.log(payload);

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { username },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async register(registerUserDto: RegisterUsersDto): Promise<User> {
    const userExists = await this.userRepository.findOne({
      where: { username: registerUserDto.username },
    });
    if (userExists) {
      throw new HttpException('User already exists.', HttpStatus.CONFLICT);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      registerUserDto.password,
      saltRounds,
    );
    const roles = await this.roleRepository.find({ where: { id: 1 } });
    const newUser = this.userRepository.create({
      ...registerUserDto,
      password: hashedPassword,
      roles,
    });

    await this.userRepository.save(newUser);

    return newUser;
  }
}
