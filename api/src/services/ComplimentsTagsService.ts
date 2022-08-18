import { ComplimentsTagsRepository } from "../repositories/ComplimentsTagsRepository";

const repository = new ComplimentsTagsRepository();

class ComplimentsTagsService {
    async criar(elogio_id: number, etiquetas: number[]) {
        if (!elogio_id || !etiquetas || etiquetas.length < 1)
            throw new Error("Elogio ou etiquetas não informadas");

        let result = []
        await Promise.all(etiquetas.map(async(id) => {
            result.push( await repository.criar(elogio_id, id) );
        }))
        
        return result;
    }

    async buscarPorElogio(elogio_id: number, somenteEtiquets?: boolean) {
        if (!elogio_id)
            throw new Error("Elogio não informado");

        const etiquetasElogios = await repository.buscar(elogio_id);

        return somenteEtiquets
            ? etiquetasElogios.map((x) => {
                return { id: x.etiqueta_id, nome: x.etiqueta_nome }
            })
            : etiquetasElogios;
    }
}

export { ComplimentsTagsService }