import { ChangePasswordDto } from "../dtos/change-password.dto";

export class ChangePasswordDoc {
    static body = { required: true, type: ChangePasswordDto }

    static operation = { summary: 'Alterar de senha de usuário' }

    static okResponse = { example: { message: 'Sucesso ao atualizar senha' } }

    static badRequest = { example: { message: 'Erro ao atualizar senha', error: 'string' } }

    static notFound = { example: { message: 'Erro ao atualizar senha: Usuário não encontrado', error: 'string' } }
}