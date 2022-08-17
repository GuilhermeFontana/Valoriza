import { Request, Response } from "express"
import { AuthenticateService } from "../services/AuthenticateService"

const service = new AuthenticateService();

class AuthenticateController {
    async login (req: Request, res: Response) {
        const {email, senha} = req.body


        return res.json(
            await service.login({ email, senha })
        );
    }

    async forgotPassword (req: Request, res: Response) {
        const { email } = req.body

        return res.json(
            await service.forgotPassword({ email })
        );
    }

    async changePassword(req: Request, res: Response) {
        const  { token } = req.query;
        const { senha, confSenha } = req.body;
        
        return res.json(
             await service.changePassword(token.toString(),senha, confSenha)
        );
    }
}

export { AuthenticateController }