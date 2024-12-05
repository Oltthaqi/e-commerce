import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET,
      ) as jwt.JwtPayload & {
        username?: string;
        roles?: string[];
        permissions?: string[];
        sub?: string | number;
      };

      if (!decoded || typeof decoded !== 'object') {
        throw new UnauthorizedException('Invalid token payload');
      }

      request.user = {
        userId: decoded.sub,
        username: decoded.username,
        roles: decoded.roles,
        permissions: decoded.permissions,
      };

      const userPermissions = request.user.permissions || [];
      const hasPermission = requiredPermissions.every((permission) =>
        userPermissions.includes(permission),
      );

      return hasPermission;
    } catch (err) {
      console.error(err.message);
      throw new UnauthorizedException('you cant access this route');
    }
  }
}
