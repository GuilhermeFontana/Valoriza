import { Request, Response } from "express";
import { UserService } from "../services/UserService"

const service = new UserService();

class UserController {
    async criar(req: Request, res: Response) {
        const { nome, senha, email, admin } = req.body;
        
        res.json(await service.criar({ nome, senha, email, admin }));
    }

    async buscar(req: Request, res: Response) {
        const { nome, senha, email, admin } = req.body;
        
        res.json(await service.buscar({ nome, senha, email, admin }));
    }
}

export { UserController }