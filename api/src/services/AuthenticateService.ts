import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import moment from "moment";
import { sendEmail } from "../resources/email/nodemailer";
import { UserRepository } from "../repositories/UserRepository";
import { UserService } from "./UserService";

interface IAuthenticateRequest {
    email: string;
    senha: string;
}
interface IForgotPasswordRequest {
    email: string;
}

class AuthenticateService {
    async login({ email, senha }: IAuthenticateRequest) {
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
                expiresIn: process.env.EXPIRES_HOURS + "h"
        })

        return { 
            token, 
            id: usu.id,
            nome: usu.nome,
            admin: usu.admin
        }
    }

    async forgotPassword({ email }: IForgotPasswordRequest) {
        if (!email) 
            throw new Error("Email não informado");

        const userService = new UserService();
        const usu = await userService.buscarUm({ email })
        if (!usu)
            return

        const EXPIRES_HOURS = process.env.EXPIRES_HOURS
        
        const token = sign({
                userId: usu.id
            }, 
            process.env.SECRETE, 
            { 
                subject: usu.id,
                expiresIn: EXPIRES_HOURS + "h"
        })

        return await sendEmail(
            email, 
            "Valoriza - Redefinir Senha", 
            "forgot_password", 
            { 
                token,
                url: process.env.BASE_URL + process.env.FORGOT_PASSWORD_ROUTE,
                expiresTime: moment().add(Number(EXPIRES_HOURS), "h").format("DD/MM/YYYY HH:mm:ss"), 
        });
    }
}

export { AuthenticateService }