import { Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  // constructor(
  //   private readonly jwtService: JwtService,
  //   private readonly userService: UserService,
  // ) {}
  // async login(username: string, password: string) {
  //   const user = await this.userService.validateUser(username, password);
  //   if (!user) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }
  //   const roles = await this.userService.getUserRoles(user.id); // Fetch user roles
  //   const permissions = await this.userService.getUserPermissions(user.id); // Fetch user permissions
  //   const payload = {
  //     sub: user.id,
  //     username: user.username,
  //     roles: roles.map((role) => role.role_name),
  //     permissions: permissions.map((permission) => permission.name),
  //   };
  //   return {
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }
}
