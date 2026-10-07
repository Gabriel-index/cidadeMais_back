import { Module } from '@nestjs/common';
import { ProblemaController } from './problema.controller';
import { ProblemaService } from './problema.service';

@Module({
    controllers: [ProblemaController],
    providers: [ProblemaService],
})
export class ProblemaModule {}