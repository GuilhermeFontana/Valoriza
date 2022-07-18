import { Request, Response } from "express";
import { UserService } from "../services/UserService"

class UserController {
    async criar(req: Request, res: Response) {
        const { nome, email, admin } = req.body;

        const service = new UserService();
        
        res.json(await service.criar({ nome, email, admin }));
    }
}

export { UserController }