import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/cauth.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(authData: LoginDto) {
    const { email, password } = authData;
    // check if user exist
    const isUserExist = await this.userService.findOneByEmail(email);
    if (!isUserExist) {
      throw new UnauthorizedException('Wrong credentials');
    }
    // check password is correct
    const passwordMatched = await bcrypt.compare(
      password,
      isUserExist.password,
    );
    if (!passwordMatched) {
      throw new UnauthorizedException('Wrong credentials');
    }

    // create auth token
    const { password: p, ...rest } = isUserExist;
    return this.generateAuthToken(rest);
  }

  generateAuthToken(user) {
    const accessToken = this.jwtService.sign({ user });
    return {
      accessToken,
    };
  }
}
