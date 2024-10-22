import { User } from "./user-example";

export class FindOneDoc {
    static okResponse = { example: User }

    static operation = { summary: 'Buscar usuário por ID' }

    static param = { name: 'id', required: true, description: 'ID do usuário' }

    static notFound = { example: { message: 'Usuário não encontrado', error: 'string' } }
}