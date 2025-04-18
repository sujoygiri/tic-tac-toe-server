import { Body, Controller, Post, Req, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSignInDto, UserSignUpDto } from './dto/user.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUpUser(
    @Body(new ValidationPipe()) userDetails: UserSignUpDto,
    @Req() request: Request,
  ) {
    const signedUpUserData = await this.authService.signUpUser(userDetails);
    request.session.userData = signedUpUserData?.result;
    return signedUpUserData;
  }

  @Post('signin')
  async signInUser(
    @Body(new ValidationPipe()) userDetails: UserSignInDto,
    @Req() request: Request,
  ) {
    const signedInUserData = await this.authService.signInUser(userDetails);
    request.session.userData = signedInUserData?.result;
    return signedInUserData;
  }

  @Post('verify')
  async verifyUser(@Req() request: Request) {
    const sessionId = request.sessionID;
    return await this.authService.verifyUser(sessionId);
  }
}
