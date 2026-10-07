import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProblemaModule } from './problema/problema.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    ProblemaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}