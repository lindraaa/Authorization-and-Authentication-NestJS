import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';

@Module({
  // providers: [HashingService, BcryptService]
  providers:[
    {
      provide:HashingService,
      useClass:BcryptService,
    },
  ]
  
})
export class AuthModule {}
