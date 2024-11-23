import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignUpDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signupData: SignUpDto) {
    return await this.authService.login(signupData);
  }

  @Post('login')
  async login(@Body() authData: LoginDto) {
    return await this.authService.login(authData);
  }
}
