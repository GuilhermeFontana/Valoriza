import { Request, Response } from "express";
import { UserService } from "../services/UserService"

class UserController {
    async criar(req: Request, res: Response) {
        const { nome, senha, email, admin } = req.body;

        const service = new UserService();
        
        res.json(await service.criar({ nome, senha, email, admin }));
    }
}

export { UserController }