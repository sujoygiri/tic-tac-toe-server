import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UserDetails } from 'src/interface/common.interfaces';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}
  async signUpUser(userDetails: UserDetails) {}
}
