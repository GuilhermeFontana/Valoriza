import { Request, Response } from "express";
import { TagService } from "../services/TagService";

class TagController {
    async criar(req: Request, res: Response) {
        const { nome } = req.body;
        
        const service = new TagService();

        res.json(await service.criar({ nome }));
    }
}

export { TagController }