import { IsEmail, IsNotEmpty, Length, MinLength, IsString } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  nome!: string;

  @IsEmail()
  email!: string;

  @Length(8, 8)
  cep!: string;

  @MinLength(6)
  senha!: string;
}