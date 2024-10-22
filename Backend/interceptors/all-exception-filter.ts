import { Request, Response } from 'express';
import { DynamicException } from './dynamic-exception'; // Importar a classe de exceção dinâmica
import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        // Chama o DynamicException para lidar com o erro
        try {
            const dynamicException = new DynamicException(exception, 'Request Handling', 'pt'); // Passando 'pt' para português

            // O dynamicException lança o erro formatado e registrado
        } catch (error) {
            // No caso de algum erro interno no processamento da exceção
            const status = HttpStatus.INTERNAL_SERVER_ERROR;
            const message = 'Ocorreu um erro inesperado ao lidar com a exceção';

            this.logger.error({
                message,
                status,
                timestamp: new Date().toISOString(),
                path: request.url,
            });

            response.status(status).json({
                statusCode: status,
                message,
                timestamp: new Date().toISOString(),
                path: request.url,
            });
        }
    }
}
