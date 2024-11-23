import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  async login(authData: LoginDto) {}
}
