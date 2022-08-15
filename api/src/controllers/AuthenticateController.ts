import { Request, Response } from "express"
import { AuthenticateService } from "../services/AuthenticateService"

class AuthenticateController {
    async login (req: Request, res: Response) {
        const {email, senha} = req.body

        const service = new AuthenticateService();

        return res.json(
            await service.login({ email, senha })
        );
    }

    async forgotPassword (req: Request, res: Response) {
        const { email } = req.body
        
        const service = new AuthenticateService();

        return res.json(
            await service.forgotPassword({ email })
        );
    }
}

export { AuthenticateController }