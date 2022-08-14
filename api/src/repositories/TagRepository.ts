import { executarSQL, getProximoId } from "../resources/database/pg";
import limparObjeto from "../utils/limparObjeto";

interface ITagInsert {
    nome: string;
}

interface ITagFindUpdate {
    nome?: string;
}

class TagRepository {
    async criar(novaEtiqueta: ITagInsert) {
        const proximoId = await getProximoId("etiqueta");   

        const sql = 
`INSERT INTO valoriza.etiqueta (id,nome)
    VALUES (${proximoId},'${novaEtiqueta.nome}');`;

        await executarSQL(sql);

        return {
            id: proximoId,
            ...novaEtiqueta
        }
    }

    async buscar(etiqueta: ITagFindUpdate) {
        etiqueta = limparObjeto(etiqueta);

        const sql = 
`SELECT id, nome
    FROM valoriza.etiqueta
    WHERE 1=1 ${Object.entries(etiqueta).map(x => ` AND LOWER(${x[0]}) LIKE LOWER('%${x[1]}%')`).join("")};`;
        
        return (await executarSQL(sql)).rows;
    }

    async buscarPorID(id: number) {
        const { rows, rowCount } = await executarSQL(`SELECT id, nome FROM valoriza.etiqueta e WHERE e.id = ${id}`)

        if (rowCount === 0)
            return null;

        return rows[0];
    }

    async buscarUm(etiqueta: ITagFindUpdate) {
        etiqueta = limparObjeto(etiqueta);

        const sql = 
`SELECT id, nome
    FROM valoriza.etiqueta
    WHERE 1=1 ${Object.entries(etiqueta).map(x => ` AND LOWER(${x[0]}) LIKE LOWER('%${x[1]}%')`).join("")}
    LIMIT 1;`;
        
        return (await executarSQL(sql)).rows[0];
    }

    async editar(id: number, novaEtiqueta: ITagFindUpdate) {
        novaEtiqueta = limparObjeto(novaEtiqueta);

        if (Object.keys(novaEtiqueta).length === 0) 
            return {
                id 
            };

        const sql = 
`UPDATE valoriza.etiqueta
    SET ${Object.entries(novaEtiqueta).map(x => `${x[0]}='${x[1]}'`).join(", ")}
    WHERE id=${id};`

        const { rowCount } = await executarSQL(sql);

        if (rowCount === 0)
            return null;

        return {
         id,
         ...novaEtiqueta
        };
    }

    async remover(id: number){
        const sql = 
`DELETE FROM valoriza.etiqueta
WHERE id=${id};`

        return (await executarSQL(sql)).rowCount;
    }
}

export { TagRepository }