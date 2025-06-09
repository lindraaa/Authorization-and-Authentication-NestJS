import { Role } from "src/modules/users/enums/role.enun"

export interface ActiveUserData{
    sub:number,
    email:string;
    role:Role;
}