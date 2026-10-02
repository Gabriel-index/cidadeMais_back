import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as mysql from 'mysql2/promise';
import { RegisterDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  db = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  async register(dados: RegisterDto) {
    const [lista] = await this.db.query('SELECT id FROM cidadao WHERE email = ?',[dados.email],
    );

    if ((lista as any[]).length > 0) {
      throw new BadRequestException('Email já cadastrado');
    }

    const senhaHash = await bcrypt.hash(dados.senha, 10);

    await this.db.query('INSERT INTO cidadao (nome, email, senha_hash, cep) VALUES (?, ?, ?, ?)',[dados.nome, dados.email, senhaHash, dados.cep],
    );

    return { mensagem: 'Cadastro feito!' };
  }

  async login(loginDto: LoginDto) {
    const [lista] = await this.db.query('SELECT id, senha_hash FROM cidadao WHERE email = ?', [loginDto.email],
    );

    if ((lista as any[]).length === 0) {
      throw new BadRequestException('Email não cadastrado, cadastre-se para continuar')
    }

    const usuario = (lista as any[])[0];

    const testeSenha = await bcrypt.compare(loginDto.senha, usuario.senha_hash);

    if (!testeSenha) {
      throw new BadRequestException('Senha ou login incorretos');
    }
    return {
      mensagem: 'login realizado com sucesso',
      id: usuario.id
    }

  }
}