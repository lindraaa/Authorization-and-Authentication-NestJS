import { Module } from '@nestjs/common';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

@Module({
    imports:[TypeOrmModule.forFeature([User])],
    providers:[BcryptService, AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
