import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './modules/coffees/coffees.module';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './database/database/database.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [CoffeesModule, UsersModule, DatabaseModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
