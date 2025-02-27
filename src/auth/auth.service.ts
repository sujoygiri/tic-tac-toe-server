import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

import { UserDetails } from 'src/interface/common.interfaces';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}
  readonly supabaseUrl = this.configService.get<string>('SUPABASE_URL') ?? '';
  readonly supabaseKey = this.configService.get<string>('SUPABASE_KEY') ?? '';
  supabase = createClient(this.supabaseUrl, this.supabaseKey);
  async signUpUser(userDetails: UserDetails) {
    const signUpAuthData = await this.supabase.auth.signUp({
      email: userDetails.email,
      password: userDetails.password,
      options: {
        emailRedirectTo: `http:localhost:4200?name=${userDetails.username}&email=${userDetails.email}`,
        data: {
          name: userDetails.username,
          email: userDetails.email,
        },
      },
    });
    console.log(userDetails);
    console.log(signUpAuthData);
    return signUpAuthData;
  }
}
