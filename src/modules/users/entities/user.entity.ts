import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../enums/role.enun";
import { PermissionType } from "src/modules/auth/permission.type";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({unique:true})
    email:string;

    @Exclude()
    @Column()
    password:string;

    @Exclude()
    @CreateDateColumn()
    created_at: Date;

    @Column({
        type:'enum',
        enum:Role,
        default:Role.Regular
        })
    role:Role; 

    @Column({
    type: 'simple-array',
    nullable: false,
    })
    permissions: PermissionType[] = [];
}
