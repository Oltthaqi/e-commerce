import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwtStrategy.strategy';
import { UserModule } from 'src/user/user.module';
import { RolesModule } from 'src/roles/roles.module';
import { CarrierModule } from 'src/carrier/carrier.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    RolesModule,
    CarrierModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
