import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MinLength,
  IsOptional,
} from 'class-validator';

export class UserDto {
  @IsOptional({ always: true })
  @IsString()
  @MinLength(3)
  name?: string;

  @IsOptional({ always: true })
  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;
}
