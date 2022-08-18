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
    usuario: {
        id: number,
        admin: boolean
    };
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

        const remetente = await userServiece.buscarPorID(destinatario_id);
        if (!remetente)
            throw new Error("Remetente não encontrado");

        const destinatario = await userServiece.buscarPorID(destinatario_id);
        if (!destinatario)
            throw new Error("Destinatario não encontrado");

        if ((await etiquetaService.buscarPorIDs(etiquetas)).length  !== etiquetas.length)
            throw new Error("Alguma etiqueta não foi encontrada");

        const compliment = await repository.criar({
            remetente_id,
            destinatario_id,
            mensagem
        });

        const resCompliment = {
            id: compliment.id,
            remetente,
            destinatario,
            mensagem,
            etiquetas: await elogiosEtiquetasSevice.criar(compliment.id, etiquetas)
        }

        return resCompliment;
    }

    async buscar({ remetente_id, destinatario_id, etiqueta_id }: IComplimentFind) {
        if (!destinatario_id && !remetente_id)
            throw new Error("Informe um destinatário ou um remetente")

        return await repository.buscar({ remetente_id, destinatario_id, etiqueta_id });
    }

    async remover({usuario, elogio_id}: IComplimentRemove) {
        if (!usuario || !elogio_id)
            throw new Error("Usuário ou id do elogio não preenchido")

        const elogio = await repository.buscarPorID(elogio_id, false);
        if (!elogio)
            throw new Error("Elogio não encontrado");

        if (!usuario.admin && usuario.id !== Number(elogio.remetente))
            throw new Error("Você não pode remover o elogio de outro usuário, sem ser administrador");

        await repository.remover(elogio.id);
    }
}

export { ComplimentService }