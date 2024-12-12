import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Verification } from 'src/verification/entities/verification.entity';
import { VerificationService } from 'src/verification/verification.service';
import { EmailService } from 'src/message/email.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private emailService: EmailService,
    private verificationTokenService: VerificationService,
    @InjectRepository(Verification)
    private verificationRepository: Repository<Verification>,
  ) {}

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
  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepo.findOne({
      where: { email: createUserDto.email },
    });
    if (user) {
      throw new BadRequestException('User already exists');
    }

    const userToCreate = this.userRepo.create({
      ...createUserDto,
      isVerified: false,
    });

    const savedUser = await this.userRepo.save(userToCreate);

    await this.generateEmailVerification(savedUser.id);
    return savedUser;
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

  async generateEmailVerification(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.emailVerifiedAt) {
      throw new UnprocessableEntityException('Account already verified');
    }

    const otp = await this.verificationTokenService.generateOtp(user.id);

    await this.emailService.sendEmail({
      subject: 'e-commerce - Account Verification',
      recipients: [{ name: user.username ?? '', address: user.username }],
      html: `<p>Hi ${user.username} ,</p><p>You may verify your MyApp account using the following OTP: <br /><span style="font-size:24px; font-weight: 700;">${otp}</span></p><p>Regards,<br />MyApp</p>`,
    });
  }

  async verifyEmail(token: string) {
    const invalidMessage = 'Invalid or expired OTP';
    const verificationId = await this.verificationRepository.findOne({
      where: { token: token },
    });

    const user = await this.userRepo.findOne({
      where: { id: verificationId.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    if (user.emailVerifiedAt) {
      throw new UnprocessableEntityException('Account already verified');
    }

    const isValid = await this.verificationTokenService.validateOtp(
      user.id,
      token,
    );
    await this.verificationTokenService.cleanUpExpiredTokens();

    if (!isValid) {
      throw new UnprocessableEntityException(invalidMessage);
    }

    user.emailVerifiedAt = new Date();
    user.isVerified = true;

    await this.userRepo.save(user);

    return true;
  }
}
