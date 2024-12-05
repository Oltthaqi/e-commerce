import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterUsersDto } from './dto/register-User.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login to get a JWT token' })
  @ApiResponse({ status: 200, description: 'JWT access token returned.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @ApiBody({ type: LoginDto })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.username, loginDto.password);
  }

  @ApiOperation({ summary: 'Register an user' })
  @ApiBody({ type: RegisterUsersDto })
  @Post('Register')
  async register(@Body() registerUserDto: RegisterUsersDto) {
    return this.authService.register(registerUserDto);
  }
}
