import { ComplimentRepository } from "../repositories/ComplimentRepository";
import { UserService } from "./UserService";
import { TagService } from "./TagService";
import { ComplimentsTagsService } from "./ComplimentsTagsService";

interface IComplimentInsert {
    remetente_id: number;
    destinatario_id: number;
    etiquetas: number[];
    mensagem?: string;
}

interface IComplimentFind {
    remetente_id?: number;
    destinatario_id?: number;
    etiqueta_id?: number;
    mensagem?: string;
}

interface IComplimentRemove {
    remetente_id: number;
    elogio_id: number;
}


const repository = new ComplimentRepository();
const userServiece = new UserService();
const etiquetaService = new TagService();
const elogiosEtiquetasSevice = new ComplimentsTagsService

class ComplimentService {
    async criar({ remetente_id, destinatario_id, etiquetas, mensagem }: IComplimentInsert) {
        if (!remetente_id || !destinatario_id || !etiquetas || etiquetas.length < 1)
            throw new Error("Remetente, destinatário ou etiqueta não preenchido")

        if (remetente_id === destinatario_id) 
            throw new Error("Você não pode se elogiar")

        if (!(await userServiece.buscarPorID(destinatario_id)))
            throw new Error("Destinatario não encontrado");

        if ((await etiquetaService.buscarPorIDs(etiquetas)).length  !== etiquetas.length)
            throw new Error("Alguma etiqueta não foi encontrada");

        const compliment = await repository.criar({
            remetente_id, 
            destinatario_id,  
            mensagem
        });
            
        compliment.etiquetas = await elogiosEtiquetasSevice.criar(compliment.id, etiquetas);

        return compliment;
    }

    async buscar({ remetente_id, destinatario_id, etiqueta_id }: IComplimentFind) {
        if (!destinatario_id && !remetente_id)
            throw new Error("Informe um destinatário ou um remetente")
        
        return await repository.buscar({ remetente_id, destinatario_id, etiqueta_id });
    }

    async remover({remetente_id, elogio_id}: IComplimentRemove) {
        if (!remetente_id || !elogio_id)
            throw new Error("Remetente ou id do elogio não preenchido")
    
        const elogio = await repository.buscarPorID(elogio_id, false);
        if (!elogio)
            throw new Error("Elogio não encontrado");

        if (remetente_id !== Number(elogio.remetente))
            throw new Error("Você não pode remover o elogio de outro usuário");

        await repository.remover(elogio.id);
    }
}

export { ComplimentService }