import { compare } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import moment from "moment";
import { sendEmail } from "../resources/email/nodemailer";
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

        const userService = new UserService();
        const usu = await userService.buscarUm({ email }, true);
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

        const FAST_EXPIRES_MINUTES = process.env.FAST_EXPIRES_MINUTES
        
        const token = sign({}, 
            process.env.SECRETE, 
            { 
                subject: usu.id,
                expiresIn: FAST_EXPIRES_MINUTES + "m"
        })

        return await sendEmail(
            email, 
            "Valoriza - Redefinir Senha", 
            "forgot_password", 
            { 
                token,
                url: process.env.BASE_URL + process.env.FORGOT_PASSWORD_ROUTE,
                expiresTime: moment().add(Number(FAST_EXPIRES_MINUTES), "m").format("DD/MM/YYYY HH:mm:ss")
        });
    }

    async changePassword(cpToken: string, senha: string, confSenha: string) {
        if (!cpToken)
            throw new Error("Token não encontrado");

        if (!senha || !confSenha)
            throw new Error("Senha ou confirmação não informada");

        if (senha !== confSenha)
            throw new Error("As senhas não conferem");

        if(!cpToken.startsWith("Bearer"))
            throw new Error("Token inválido");

        const [, token] = cpToken.split(" ");

        try {
            const { sub } = verify(token, process.env.SECRETE);

            const userService = new UserService();
            userService.editar(Number(sub), { senha });
        }
        catch (err) {
            if (err.name === "TokenExpiredError")
                throw new Error("Você demorou muito... Reenvie o email");
            
            throw new Error("Erro ao redefinir senha");
        }
    }
}   

export { AuthenticateService }