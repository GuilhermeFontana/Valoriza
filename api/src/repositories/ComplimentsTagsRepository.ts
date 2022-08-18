import { executarSQL } from "../resources/database/pg";
import { TagService } from "../services/TagService";


const tagService = new TagService();

class ComplimentsTagsRepository {

    async criar(elogio_id:number, etiqueta_id: number) {
        const sql = 
`INSERT INTO valoriza.elogios_etiquetas (etiqueta_id,elogio_id)
    VALUES (${etiqueta_id}, ${elogio_id});`;

        await executarSQL(sql);

        return await tagService.buscarPorID(etiqueta_id);
    }

    async buscar(elogio_id?: number) {
        const sql = 
`SELECT ee.elogio_id, 
        ee.etiqueta_id, 
        e.nome as etiqueta_nome
    FROM valoriza.elogios_etiquetas ee
INNER JOIN valoriza.etiqueta e 
    ON e.id = ee.etiqueta_id
WHERE ee.elogio_id = ${elogio_id};`
    
        return (await executarSQL(sql)).rows;
    }

    async remover(elogio_id: number) {
        const sql = 
`DELETE FROM valoriza.elogios_etiquetas
    WHERE elogio_id=${elogio_id};`;

        await executarSQL(sql);
    }
}

export { ComplimentsTagsRepository }