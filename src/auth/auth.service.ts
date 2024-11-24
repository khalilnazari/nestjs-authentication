import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto, RefreshTokenDto } from './dto/cauth.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refreshToken.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private readonly tokenRepository: Repository<RefreshToken>,
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
    return await this.generateAuthToken(rest);
  }

  async storeRefershToken(refreshToken: string, userId: string) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);

    const tokenData = this.tokenRepository.create({
      expiryDate,
      userId,
      refreshToken,
    });

    return await this.tokenRepository.save(tokenData);
  }

  async getRefreshToken(data: RefreshTokenDto) {
    const { refreshToken, userId } = data;
    const isTokenExist = await this.tokenRepository.findOneBy({
      refreshToken,
      expiryDate: MoreThanOrEqual(new Date()),
      userId,
    });
    if (!isTokenExist) throw new UnauthorizedException('token does not exist');

    const user = await this.userService.findOneById(isTokenExist.userId);
    if (!user) throw new UnauthorizedException('token does not exist');

    const { password, ...rest } = user;
    return await this.generateAuthToken(rest);
  }

  async generateAuthToken(user) {
    const refereshToken = uuidv4();

    const accessToken = await this.jwtService.signAsync(user, {
      expiresIn: '1h',
    });

    await this.removeRefreshToken(user.id);
    await this.storeRefershToken(refereshToken, user.id);

    return {
      accessToken,
      refereshToken,
    };
  }

  async removeRefreshToken(userId: string) {
    const token = await this.tokenRepository.findOneBy({ userId });

    if (token) {
      await this.tokenRepository.delete(token.id);
    }
  }
}
