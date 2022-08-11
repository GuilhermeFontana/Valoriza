import { Request, Response } from "express";
import { TagService } from "../services/TagService";

const service = new TagService();

class TagController {
    async criar(req: Request, res: Response) {
        const { nome } = req.body;

        res.json(await service.criar({ nome }));
    }
    
    async buscar(req: Request, res: Response) {
        const { nome } = req.body;
    
        res.json(await service.buscar({ nome }));
    }

    async editar(req: Request, res: Response) {
        const { ID } = req.params;
        const { nome } = req.body;
    
        res.json(await service.editar(Number(ID), { nome }));
    }

    async remover(req: Request, res: Response) {
        const { ID } = req.params;
        
        res.json(await service.remover(Number(ID)));
    }
}

export { TagController }