import { Request, Response } from "express";
import { UserService } from "../services/UserService"

const service = new UserService();

class UserController {
    async criar(req: Request, res: Response) {
        const { nome, senha, email, admin } = req.body;
        
        res.json(await service.criar({ nome, senha, email, admin }));
    }

    async buscar(req: Request, res: Response) {
        const { nome, email, admin } = req.body;
        
        res.json(await service.buscar({ nome, email, admin }));
    }

    async buscarPorId(req: Request, res: Response) {
        const { ID } = req.params;

        res.json(await service.buscarPorID(Number(ID)));
    }

    async editar(req: Request, res: Response) {
        const { id } = req.user;
        const { nome, email, admin } = req.body;

        res.json(await service.editar(Number(id), { 
            nome,
            email,
            admin
         }));
    }

    async editarOutro(req: Request, res: Response) {
        const { ID } = req.params;
        const { nome, email, admin } = req.body;

        res.json(await service.editar(Number(ID), { 
            nome,
            email,
            admin
         }));
    }

    async remover(req: Request, res: Response) {
        const { id } = req.user;

        res.json(await service.remover(Number(id)));
    }

    async removerOutro(req: Request, res: Response) {
        const { ID } = req.params;

        res.json(await service.remover(Number(ID)));
    }

}

export { UserController }