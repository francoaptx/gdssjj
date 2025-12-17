import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AdminRoutingSheetsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role || user.role.name !== 'ADMIN') {
      throw new ForbiddenException('Acceso denegado. Solo los administradores pueden acceder a esta sección.');
    }

    return true;
  }
}