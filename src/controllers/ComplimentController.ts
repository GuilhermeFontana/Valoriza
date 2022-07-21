import { Request, Response } from "express";
import { ComplimentService } from "../services/ComplimentService";

const service = new ComplimentService();

class ComplimentController {
    async criar(req: Request, res: Response) {
        const { remetente_id, destinatario_id, etiqueta_id, mensagem } = req.body;

        res.json(await service.criar({ remetente_id, destinatario_id, etiqueta_id, mensagem }));
    }
}

export { ComplimentController }