export class DeleteDoc {
    static operation = { summary: 'Deletar registro de usuário' }

    static param = { name: 'id', required: true, description: 'ID do usuário' }

    static okResponse = { example: { message: 'Sucesso ao deletar', affected: 1 } }

    static badRequest = { example: { message: 'Erro ao deletar', error: 'string' } }
}