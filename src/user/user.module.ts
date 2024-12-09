import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RolesModule } from 'src/roles/roles.module';
import { MessageModule } from 'src/message/message.module';
import { VerificationModule } from 'src/verification/verification.module';
import { VerificationService } from 'src/verification/verification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RolesModule,
    MessageModule,
    VerificationModule,
  ],
  providers: [UserService, VerificationService],
  controllers: [UserController],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
