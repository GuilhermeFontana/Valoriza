import { Request, Response } from "express"
import { AuthenticateService } from "../services/AuthenticateService"

class AuthenticateController {
    async handle (req: Request, res: Response) {
        const {email, senha} = req.body

        const service = new AuthenticateService();

        return res.json(
            await service.executar({ email, senha })
        );
    }
}

export { AuthenticateController }