import { ComplimentRepository } from "../repositories/ComplimentRepository";
import { UserService } from "./UserService";
import { TagService } from "./TagService";

interface IComplimentInsert {
    remetente_id: number;
    destinatario_id: number;
    etiqueta_id: number;
    mensagem?: string;
}

const repository = new ComplimentRepository();
const userServiece = new UserService();
const etiquetaService = new TagService();

class ComplimentService {
    async criar({ remetente_id, destinatario_id, etiqueta_id, mensagem }: IComplimentInsert) {
        if (!remetente_id || !destinatario_id || !etiqueta_id)
            throw new Error("Remetente, destinatário ou etiqueta não preenchido")

        if (remetente_id === destinatario_id) 
            throw new Error("Você não pode se elogiar")

        if (!(await userServiece.buscarPorID(destinatario_id)))
            throw new Error("Destinatario não encontrado");

        if (!(await etiquetaService.buscarPorID(etiqueta_id)))
            throw new Error("Etiqueta não encontrada");

        return await repository.criar({
            remetente_id, 
            destinatario_id, 
            etiqueta_id, 
            mensagem
        });
    }
}

export { ComplimentService }