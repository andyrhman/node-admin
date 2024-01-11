import { IsString, Length, IsEmail, IsNotEmpty, IsInt } from 'class-validator';

export class CreateUserDTO {
  @IsString({ message: 'Full name must be a string' })
  @IsNotEmpty({message: "Full name should not be empty"})
  fullname: string;

  @IsString()
  @IsNotEmpty({message: "Full name should not be empty"})
  @Length(3, 30, { message: 'Username must be between 3 and 30 characters' })
  username: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({message: "Full name should not be empty"})
  email: string;

  @IsInt({ message: 'Role must be a integer' })
  @IsNotEmpty({message: "Full name should not be empty"})
  role_id: number;
}
