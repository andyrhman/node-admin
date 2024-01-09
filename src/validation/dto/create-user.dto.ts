import { IsString, Length, IsEmail } from 'class-validator';

export class RegisterDto {
  @IsString({ message: 'Full name must be a string' })
  fullname: string;

  @IsString()
  @Length(3, 30, { message: 'Username must be between 3 and 30 characters' })
  username: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;
}
