import { User } from "./user-example";
import { CreateUserDto } from "../dtos/create-user.dto";

export class CreateDoc {
    static createdResponse = { example: User }

    static operation = { summary: 'Inserir usuário' }

    static body = { required: true, type: CreateUserDto }

    static conflict = { example: { message: 'Erro ao inserir', error: 'string' } }

    static badRequest = { example: { message: 'Erro ao inserir', error: 'string' } }
}