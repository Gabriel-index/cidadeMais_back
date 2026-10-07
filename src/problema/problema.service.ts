import { Injectable, NotFoundException } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

@Injectable()
export class ProblemaService {

    db = mysql.createPool({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });


    // ======================================================
    // BUSCAR TODAS AS DENÚNCIAS
    // ======================================================

    async buscarTodos() {

        const [resultado] = await this.db.query(
            'SELECT * FROM problema ORDER BY criado_em DESC'
        );

        return resultado;
    }


    // ======================================================
    // BUSCAR UMA DENÚNCIA PELO ID
    // ======================================================

    async buscarPorId(id: number) {

        const [resultado] = await this.db.query(
            'SELECT * FROM problema WHERE id = ?',
            [id]
        );

        const problemas = resultado as any[];

        if (problemas.length === 0) {

            throw new NotFoundException(
                'Problema não encontrado'
            );

        }

        return problemas[0];
    }
}