import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MinLength,
  IsNotEmpty,
} from 'class-validator';

export class UserSignInDto {
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  password: string;
}

export class UserSignUpDto extends UserSignInDto {
  @IsString()
  @MinLength(3)
  name?: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;
}
