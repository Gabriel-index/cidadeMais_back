import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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

  constructor(private jwtService: JwtService) {}

  async register(dados: RegisterDto) {
  const [lista] = await this.db.query(
    'SELECT id FROM cidadao WHERE email = ?',
    [dados.email],
  );

  if ((lista as any[]).length > 0) {
    throw new BadRequestException('Email já cadastrado');
  }

  // 1. consulta o CEP no ViaCEP
  const respostaCep = await fetch(
    'https://viacep.com.br/ws/' + dados.cep + '/json/',
  );

  if (!respostaCep.ok) {
    throw new BadRequestException('CEP inválido');
  }

  const endereco: any = await respostaCep.json();

  if (endereco.erro) {
    throw new BadRequestException('CEP não encontrado');
  }

  // 2. embaralha a senha
  const senhaHash = await bcrypt.hash(dados.senha, 10);

  // 3. salva tudo no banco
  await this.db.query(
    'INSERT INTO cidadao (nome, email, senha_hash, cep, bairro, cidade, estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [
      dados.nome,
      dados.email,
      senhaHash,
      dados.cep,
      endereco.bairro,
      endereco.localidade,
      endereco.uf,
    ],
  );

  return { mensagem: 'Cadastro feito!' };
}

  async login(loginDto: LoginDto) {
    const [lista] = await this.db.query(
      'SELECT id, senha_hash FROM cidadao WHERE email = ?',
      [loginDto.email],
    );

    if ((lista as any[]).length === 0) {
      throw new BadRequestException(
        'Email não cadastrado, cadastre-se para continuar',
      );
    }

    const usuario = (lista as any[])[0];

    const testeSenha = await bcrypt.compare(loginDto.senha, usuario.senha_hash);

    if (!testeSenha) {
      throw new BadRequestException('Senha ou login incorretos');
    }

    const token = await this.jwtService.signAsync({ sub: usuario.id });

    return {
      mensagem: 'login realizado com sucesso',
      token: token,
    };
  }

  async perfil(cabecalho: string) {
    if (!cabecalho) {
      throw new UnauthorizedException('Faça login');
    }

    const token = cabecalho.replace('Bearer ', '');
    let dadosToken: any;

    try {
      dadosToken = await this.jwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException('Token inválido');
    }

    const [lista] = await this.db.query(
      'SELECT nome, email, bairro, cidade, estado FROM cidadao WHERE id = ?',
      [dadosToken.sub],
    );

    return (lista as any[])[0];
  }
}