import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { CarrierService } from '../../carrier/carrier.service';

@Injectable()
export class CarrierGuard implements CanActivate {
  constructor(private readonly carrierService: CarrierService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    console.log(request.body);
    console.log(authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const token = authHeader.replace('Bearer ', '');
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED, error);
    }
    console.log(decoded);

    const carrierId = decoded.carrierId;
    if (!carrierId) {
      throw new HttpException(
        'Carrier ID not found in token',
        HttpStatus.FORBIDDEN,
      );
    }
    const code = request.body.code;
    if (!code) {
      throw new HttpException(
        'No code provided in request body',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hasAccess = await this.carrierService.checkCarrierOrderAccess(
      carrierId,
      code,
    );
    if (!hasAccess) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return true;
  }
}
