import { Body, Controller, Post, Req, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  async signUpUser(
    @Body(new ValidationPipe()) userDetails: UserDto,
    @Req() request: Request,
  ) {
    const signedUpUserData = await this.authService.signUpUser(userDetails);
    request.session.userData = signedUpUserData?.result;
    return signedUpUserData;
  }

  @Post('signin')
  async signInUser(
    @Body(new ValidationPipe()) userDetails: UserDto,
    @Req() request: Request,
  ) {
    const signedInUserData = await this.authService.signInUser(userDetails);
    request.session.userData = signedInUserData?.result;
    return signedInUserData;
  }

  @Post('verify')
  async verifyUser(@Req() request: Request) {
    // console.log(request.headers.cookie);
    // console.log(request.session);
    // console.log(request.sessionID);

    const sessionId = request.sessionID;
    const authorizedUserData = await this.authService.verifyUser(sessionId);
    return authorizedUserData;
  }
}
