export class UpdateDoc {
    static operation = { summary: 'Atualizar dados de usuário' }

    static param = { name: 'id', required: true, description: 'ID do usuário' }

    static okResponse = { example: { message: 'Sucesso ao atualizar', affected: 1 } }

    static badRequest = { example: { message: 'Erro ao atualizar', error: 'string' } }
}