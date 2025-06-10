import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PERMISSION_KEY } from '../../decorators/permissions.decorator';
import { ActiveUserData } from '../../interface/active-user-data.interface';
import { REQUEST_USER_KEY } from '../../auth.constant';
import { PermissionType } from '../../permission.type';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector:Reflector){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
 const contextPermissions = this.reflector.getAllAndOverride<PermissionType[] >(PERMISSION_KEY,[
      context.getHandler(),
      context.getClass(),
    ]);
    if(!contextPermissions){
      return true
      // If the route does NOT specify any required roles
      // let anyone access it.


    }

    const user:ActiveUserData = context.switchToHttp().getRequest()[
      REQUEST_USER_KEY 
    ];
    // console.log(user)
    return contextPermissions.every((permission)=>user.permissions?.includes(permission))
  }  
}

