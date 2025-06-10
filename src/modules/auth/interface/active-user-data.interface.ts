import { Role } from "src/modules/users/enums/role.enun"
import { PermissionType } from "../permission.type";

export interface ActiveUserData{
    sub:number,
    email:string;
    role:Role;
    permissions:PermissionType[]
}