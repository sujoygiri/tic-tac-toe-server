import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  signUpUser(@Body(new ValidationPipe()) userDetails: UserDto) {
    return this.authService.signUpUser(userDetails);
  }
}
