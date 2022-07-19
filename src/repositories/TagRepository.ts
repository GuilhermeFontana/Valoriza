import { executarSQL, getProximoId } from "../database/pg";
import toPascaCase from "../utils/toPascalCase"

interface ITag {
    nome: string;
}

class TagRepository {
    async criar(novaEtiqueta: {nome: string;}) {
        const proximoId = await getProximoId("etiqueta");

        novaEtiqueta.nome = toPascaCase(novaEtiqueta.nome);   

        const sql = 
`INSERT INTO valoriza.etiqueta (id,nome)
    VALUES (${proximoId},'${novaEtiqueta.nome}');`;

        await executarSQL(sql);

        return {
            id: proximoId,
            ...novaEtiqueta
        }
    }

    async buscar(etiqueta: ITag) {
        const sql = 
`SELECT id, nome
    FROM valoriza.etiqueta
    WHERE LOWER(nome) like LOWER('%${etiqueta.nome}%');`;
        
        return (await executarSQL(sql)).rows;
    }

    async buscaPorID(id: number) {
        const { rows, rowCount } = await executarSQL(`SELECT 1 AS value FROM valoriza.etiqueta e WHERE e.id = ${id}`)

        if (rowCount === 0)
            throw new Error("Etiqueta não encontrada");

        return rows[0];
    }

    async buscaUm(etiqueta: ITag) {
        const sql = 
`SELECT id, nome
    FROM valoriza.etiqueta
    WHERE LOWER(nome) like LOWER('%${etiqueta.nome}%')
    LIMIT 1;`;
        
        return (await executarSQL(sql)).rows[0];
    }

    async editar(id: number, novaEtiqueta: ITag) {
        novaEtiqueta.nome = toPascaCase(novaEtiqueta.nome);

        const sql = 
`UPDATE valoriza.etiqueta
    SET nome='2'
    WHERE id=${id};`

        const { rowCount } = await executarSQL(sql);

        if (rowCount === 0)
            throw new Error("Etiqueta não encontrada");

        return {
         id,
         ...novaEtiqueta
        };
    }

    async remover(id: number){
        const sql = 
`DELETE FROM valoriza.etiqueta
WHERE id=${id};`

        const { rowCount } = await executarSQL(sql);

        if (rowCount === 0)
            throw new Error("Etiqueta não encontrada");

        return rowCount;
    }
}

export { TagRepository }