import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from 'src/modules/users/enums/role.enun';
import { ROLES_KEY } from '../../decorators/roles.decorator';
import { ActiveUserData } from '../../interface/active-user-data.interface';
import { REQUEST_USER_KEY } from '../../auth.constant';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector:Reflector){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const contextRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY,[
      context.getHandler(),
      context.getClass(),
    ]);
    if(!contextRoles){
      return true
      // If the route does NOT specify any required roles
      // let anyone access it.


    }

    const user:ActiveUserData = context.switchToHttp().getRequest()[
      REQUEST_USER_KEY
    ];
    console.log(user)
    return contextRoles.some((role)=>user.role===role);
  }
}
