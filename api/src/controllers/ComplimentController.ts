import { Request, Response } from "express";
import { ComplimentService } from "../services/ComplimentService";

const service = new ComplimentService();

class ComplimentController {
    async elogiar(req: Request, res: Response) {
        const { destinatario_id, etiquetas, mensagem } = req.body;
        const { id } = req.user;

        res.json(await service.criar({ remetente_id: id , destinatario_id, etiquetas, mensagem }));
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

    async buscarRecebidosPorUsuario(req: Request, res: Response) {
        const { etiqueta_id, remetente_id } = req.body;
        const { ID } = req.params;

        res.json(await service.buscar({ remetente_id, destinatario_id: Number(ID), etiqueta_id,  }))
    }

    async removerElogio(req: Request, res: Response) {
        const { id, admin } = req.user;
        const { ID } = req.params;

        res.json(await service.remover({ usuario: { id, admin }, elogio_id: Number(ID) }))
    }

}

export { ComplimentController }