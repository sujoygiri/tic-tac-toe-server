import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  async signUpUser(@Body() userDetails: UserDto) {
    await this.authService.signUpUser(userDetails);
  }
}
