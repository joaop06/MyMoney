import { LoginDto } from "../dtos/login.dto";

const SuccessLogin = {
    message: "Login realizado com sucesso!",
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...wcdevHvETg0LiQkodhJNIDg5mm8rsmO8EI3jnwIMH10"
}

export class LoginDoc {
    static okResponse = { example: SuccessLogin }

    static body = { required: true, type: LoginDto }

    static operation = { summary: 'Login de usuário' }

    static unauthorized = { example: { message: 'Credenciais inválidas', error: 'string' } }
}