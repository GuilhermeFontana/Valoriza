import { executarSQL, getProximoId } from "../resources/database/pg";
import { ComplimentsTagsService } from "../services/ComplimentsTagsService";
import { UserService } from "../services/UserService";
import limparObjeto from "../utils/limparObjeto";

interface IComplimentInsert {
    remetente_id: number;
    destinatario_id: number;
    mensagem?: string;
}

interface IComplimentFindUpdate {
    remetente_id?: number;
    destinatario_id?: number;
    etiqueta_id?: number;
    mensagem?: string;
}

interface ICompliment {
    id: number;
    remetente: any;
    destinatario: any;
    etiquetas: [];
    mensagem?: string;
}


class ComplimentRepository {
    async criar(novoElogio: IComplimentInsert) {
        const proximoId = await getProximoId("elogio");   
        
        if (!novoElogio.mensagem)
            delete novoElogio.mensagem;
        
        const sql = 
`INSERT INTO valoriza.elogio (id, ${Object.keys(novoElogio).join(', ')})
    VALUES (${proximoId}, '${Object.values(novoElogio).join(`', '`)}');`;

        await executarSQL(sql);

        return {
            id: proximoId,
            ...novoElogio,
            etiquetas: []
        }
    }

    async buscar(elogio: IComplimentFindUpdate) {
        elogio = limparObjeto(elogio);

        const sql = 
`SELECT id, remetente_id AS remetente, destinatario_id AS destinatario, null as etiquetas, mensagem
    FROM valoriza.elogio
    WHERE 1=1 ${Object.entries(elogio).map(x => {
        if (x[0] === "mensagem")
            return ` AND LOWER(${x[0]}) LIKE LOWER('%${x[1]}%')`
            
            return ` AND ${x[0]}='${x[1]}';`
    }).join("")}`;

        return await this.popularFKs((await executarSQL(sql)).rows)
    }
    
    async buscarPorID(id: number, popularFKs: boolean = true) {
        const sql = 
`SELECT id, remetente_id AS remetente, destinatario_id AS destinatario, null as etiquetas, mensagem
    FROM valoriza.elogio
    WHERE id = ${id};`;

        const { rows, rowCount } = await executarSQL(sql);

        if (rowCount === 0)
            return null;

        if (!popularFKs)
            return rows[0]
            
        return await this.popularFKs(rows)[0];
    }
    
    async buscarUm(elogio: IComplimentFindUpdate) {
        elogio = limparObjeto(elogio);

        const sql = 
`SELECT id, remetente_id AS remetente, destinatario_id AS destinatario, null as etiquetas, mensagem
    FROM valoriza.elogio
    WHERE 1=1 ${Object.entries(elogio).map(x => {
        if (x[0] === "mensagem")
            return ` AND LOWER(${x[0]}) LIKE LOWER('%${x[1]}%');`
            
            return ` AND ${x[0]}='${x[1]}'`
    }).join("")}
    LIMIT 1;`;
    
        return await this.popularFKs((await executarSQL(sql)).rows);

    }
    
    async remover(id: number) {
        const sql = 
`DELETE FROM valoriza.elogio
WHERE id=${id};`

        return (await executarSQL(sql)).rowCount;
    }

    private async popularFKs(elogios: ICompliment[]) {
        const userServiece = new UserService();
        const complimentsTagsService = new ComplimentsTagsService();

        return await Promise.all( 
            elogios.map(async (e) => {
                e.remetente = await userServiece.buscarPorID(e.remetente);
                e.destinatario = await userServiece.buscarPorID(e.destinatario);
                e.etiquetas = await complimentsTagsService.buscarPorElogio(e.id, true);

                return e;
            })
        )
    }
}

export { ComplimentRepository }