import { v4 as uuidv4 } from 'uuid';
import { Logger } from '@nestjs/common/services/logger.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class DynamicException {
    private logger = new Logger(DynamicException.name, { timestamp: true });

    constructor(
        private readonly error: any,
        private readonly context: string,
        private readonly locale: string = 'en',
    ) {
        this.handleException();
    }

    private handleException() {
        const errorId = uuidv4(); // Gera um identificador único para o erro

        // Extrai os detalhes da exceção
        const { message, status, errorType } = this.getErrorDetails();

        // Registra a exceção no log com detalhes completos
        this.logException(errorId, message, status, errorType);

        // Lança a exceção com mensagem formatada
        throw new HttpException(
            {
                errorId,
                errorType,
                message: this.getLocalizedMessage(message),
                timestamp: new Date().toISOString(),
            },
            status,
        );
    }

    // Método para obter detalhes sobre a exceção, como status e tipo
    private getErrorDetails() {
        if (this.error instanceof HttpException) {
            // Se for uma exceção HTTP já existente
            const status = this.error.getStatus();
            const response = this.error.getResponse() as any;
            return {
                message: response.message || this.error.message,
                status,
                errorType: response.error || this.error.name,
            };

        } else if (this.error instanceof Error) {
            // Se for uma exceção padrão do JavaScript
            return {
                message: this.error.message,
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                errorType: this.error.name || 'InternalServerError',
            };

        } else if (this.error.code === 'ER_DUP_ENTRY') {
            // Tratamento específico para erros de banco de dados, como duplicidade de chave
            return {
                errorType: 'DatabaseError',
                status: HttpStatus.CONFLICT,
                message: 'Duplicate entry detected in the database',
            };

        } else {
            // Caso genérico
            return {
                errorType: 'UnknownError',
                message: 'An unexpected error occurred',
                status: HttpStatus.INTERNAL_SERVER_ERROR,
            };
        }
    }

    // Método para logar a exceção com detalhes
    private logException(errorId: string, message: string, status: number, errorType: string) {
        this.logger.error({
            errorId,
            message,
            status,
            errorType,
            context: this.context,
            timestamp: new Date().toISOString(),
        });
    }

    // Suporte para internacionalização (i18n) de mensagens
    private getLocalizedMessage(message: string): string {
        const messages = {
            en: {
                'Duplicate entry detected in the database': 'Duplicate entry detected in the database',
                'An unexpected error occurred': 'An unexpected error occurred',
            },
            pt: {
                'Duplicate entry detected in the database': 'Entrada duplicada detectada no banco de dados',
                'An unexpected error occurred': 'Ocorreu um erro inesperado',
            },
        };
        return messages[this.locale][message] || message;
    }
}
