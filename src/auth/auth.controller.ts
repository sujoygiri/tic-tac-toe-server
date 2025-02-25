import { Body, Controller, Post } from '@nestjs/common';
import { UserDetails } from 'src/interface/common.interfaces';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  async signUpUser(@Body() userDetails: UserDetails) {
    await this.authService.signUpUser(userDetails);
  }
}
