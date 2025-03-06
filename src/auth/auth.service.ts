import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UserDto } from './dto/user.dto';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}
  async signUpUser(userDetails: UserDto) {}
}
