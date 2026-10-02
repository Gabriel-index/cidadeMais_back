import { IsEmail, IsNotEmpty, Length, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  nome!: string;

  @IsEmail()
  email!: string;

  @Length(8, 8)
  cep!: string;

  @MinLength(6)
  senha!: string;
}