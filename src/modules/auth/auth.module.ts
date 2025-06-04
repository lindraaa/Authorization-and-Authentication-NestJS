import { Module } from '@nestjs/common';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './guards/access-token/access-token.guard';
import { AuthenticationGuard } from './guards/authentication/authentication.guard';
import { RefreshTokenIdsStorage } from './refresh-token-ids.storage/refresh-token-ids.storage';

@Module({
    imports:[
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig)
],
    providers:[BcryptService, 
              AuthService,
              // {
              //   provide:APP_GUARD,
              //  useClass:AccessTokenGuard
              // }
               {
                provide:APP_GUARD,
               useClass:AuthenticationGuard
              },
              AccessTokenGuard,
              RefreshTokenIdsStorage
            ],
    controllers: [AuthController],
})
export class AuthModule {}
 