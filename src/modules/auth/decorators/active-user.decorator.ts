import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { REQUEST_USER_KEY } from "../auth.constant";
import { ActiveUserData } from "../interface/active-user-data.interface";

export const ActiveUser = createParamDecorator(
    (data: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user:ActiveUserData = request[REQUEST_USER_KEY]
    return data ? user ?.[data]:user;
  },
);