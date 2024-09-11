import { IsString, Length, IsEmail, IsOptional, IsInt } from 'class-validator';

export class UpdateInfoDTO {
  @IsString({ message: 'Full name must be a string' })
  @IsOptional()
  fullname;

  @IsString()
  @IsOptional()
  @Length(3, 30, { message: 'Username must be between 3 and 30 characters' })
  username;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsOptional()
  email;
}
