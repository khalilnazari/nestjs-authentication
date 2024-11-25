import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ForgetPasswordToken } from './entities/forgetPassword.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ForgetPasswordToken])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
