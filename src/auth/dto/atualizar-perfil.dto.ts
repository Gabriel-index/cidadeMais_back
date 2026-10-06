import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class AtualizarPerfilDto {
  @IsNotEmpty()
  nome!: string;

  @IsEmail()
  email!: string;

  @Length(8, 8)
  cep!: string;

  @IsNotEmpty()
  complemento!: string;
}