import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Verification } from './entities/verification.entity';
import { MoreThan, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { NotFoundError } from 'rxjs';
import { generateOtp } from './utils/otp.util';

@Injectable()
export class VerificationService {
  private readonly minRequestIntervalMinutes = 1;
  private readonly tokenExpirationMinutes = 15;
  private readonly saltRounds = 10;
  constructor(
    @InjectRepository(Verification)
    private verificationRepo: Repository<Verification>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async generateOtp(userId: number, size = 6): Promise<string> {
    const now = new Date();

    if (!userId) {
      throw new NotFoundError('user not found');
    }

    const recentToken = await this.verificationRepo.findOne({
      where: {
        userId,
        createdAt: MoreThan(
          new Date(now.getTime() - this.minRequestIntervalMinutes * 60 * 1000),
        ),
      },
    });

    if (recentToken) {
      throw new UnprocessableEntityException(
        'Please wait a minute before requesting a new token.',
      );
    }

    const otp = generateOtp(size);

    const tokenEntity = this.verificationRepo.create({
      userId,
      token: otp,
      expiresAt: new Date(
        now.getTime() + this.tokenExpirationMinutes * 60 * 1000,
      ),
    });

    await this.verificationRepo.delete({ userId });

    await this.verificationRepo.save(tokenEntity);

    return otp;
  }

  async validateOtp(userId: number, token: string): Promise<boolean> {
    const validToken = await this.verificationRepo.findOne({
      where: { userId, expiresAt: MoreThan(new Date()) },
    });

    if (validToken && token) {
      await this.verificationRepo.remove(validToken);
      return true;
    } else {
      return false;
    }
  }

  async cleanUpExpiredTokens() {
    const tokensdb = await this.verificationRepo.find({
      where: { expiresAt: MoreThan(new Date()) },
    });
    return this.verificationRepo.remove(tokensdb);
  }
}
