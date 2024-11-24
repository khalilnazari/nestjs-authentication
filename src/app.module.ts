import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { RefreshToken } from './auth/entities/refreshToken.entity';
import { JwtModule } from '@nestjs/jwt';
import appConfig from './config/appConfig';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'pgadmin',
      database: 'nextnestauth',
      entities: [User, RefreshToken],
      synchronize: true,
    }),
    JwtModule.register({
      global: true,
      secret: appConfig().jwt.secret,
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
