const { IsString, Length, IsEmail } = require('class-validator');
const { IsEqualTo } = require('../decorator/check-password.decorator.js');

export class RegisterDto {
  @IsString({ message: 'Full name must be a string' })
  fullname;

  @IsString()
  @Length(3, 30, { message: 'Username must be between 3 and 30 characters' })
  username;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  email;

  @IsString()
  @Length(6, undefined, { message: 'Password must be at least 6 characters long' })
  password;

  @IsString()
  @IsEqualTo('password', { message: 'Password Confirm must be the same as password' })
  password_confirm;
}
