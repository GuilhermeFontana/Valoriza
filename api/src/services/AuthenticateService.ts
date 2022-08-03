import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository";

interface IAuthenticateRequest {
    email: string;
    senha: string;
}

class AuthenticateService {
    async executar({ email, senha }: IAuthenticateRequest) {
        if (!email || !senha) 
            throw new Error("Email ou senha não informado")
        
        const repository = new UserRepository();

        const usu = await repository.buscarUm({ email }, true);
        if (!usu || !(await compare(senha, usu.senha)))
            throw new Error("Email ou senha incorreto")

        const token = sign({ 
                email: usu.email, 
                admin: usu.admin 
            }, 
            process.env.SECRETE, 
            { 
                subject: usu.id,
                expiresIn: process.env.EXPIRES_TIME
        })

        return { 
            token, 
            nome: usu.nome,
            admin: usu.admin
        }
    }
}

export { AuthenticateService }