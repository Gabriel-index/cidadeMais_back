import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dados: RegisterDto) {
    return this.authService.register(dados);
  }

  @Post('login')
  login(@Body() dados: LoginDto) {
    return this.authService.login(dados);
  }

  @Get('perfil')
  perfil(@Headers('authorization') cabecalho: string) {
    return this.authService.perfil(cabecalho);
  }
}