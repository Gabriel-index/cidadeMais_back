import { Controller, Get, Param } from '@nestjs/common';
import { ProblemaService } from './problema.service';

@Controller('problemas')
export class ProblemaController {

    constructor(
        private readonly problemaService: ProblemaService
    ) {}

    @Get()
    buscarTodos() {
        return this.problemaService.buscarTodos();
    }

    @Get(':id')
    buscarPorId(@Param('id') id: string) {
        return this.problemaService.buscarPorId(Number(id));
    }
}