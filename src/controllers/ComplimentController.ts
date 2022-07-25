import { Request, Response } from "express";
import { ComplimentService } from "../services/ComplimentService";

const service = new ComplimentService();

class ComplimentController {
    async criar(req: Request, res: Response) {
        const { destinatario_id, etiqueta_id, mensagem } = req.body;
        const { id } = req.user;

        res.json(await service.criar({ remetente_id: id , destinatario_id, etiqueta_id, mensagem }));
    }

    async buscarMeusRecebidos(req: Request, res: Response) {
        const { etiqueta_id, remetente_id } = req.body;
        const { id } = req.user;

        res.json(await service.buscar({ destinatario_id: id, etiqueta_id, remetente_id }))
    }

    async buscarMeusEviados(req: Request, res: Response) {
        const { etiqueta_id, destinatario_id } = req.body;
        const { id } = req.user;

        res.json(await service.buscar({ remetente_id: id, destinatario_id, etiqueta_id,  }))
    }

}

export { ComplimentController }