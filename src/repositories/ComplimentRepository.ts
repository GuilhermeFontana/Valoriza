import { executarSQL, getProximoId } from "../database/pg";
import { TagService } from "../services/TagService";
import { UserService } from "../services/UserService";
import limparObjeto from "../utils/limparObjeto";

interface IComplimentInsert {
    remetente_id: number;
    destinatario_id: number;
    etiqueta_id: number;
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
    etiqueta: any;
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
            ...novoElogio
        }
    }

    async buscar(elogio: IComplimentFindUpdate) {
        elogio = limparObjeto(elogio);

        const sql = 
`SELECT id, usuid_remetente AS remetente, usuid_destinatario AS destinatario, etiqueta_id, mensagem
    FROM valoriza.elogio
    WHERE 1=1 ${Object.entries(elogio).map(x => {
        if (x[1] === "mensagem")
            return ` AND LOWER(${x[0]}) LIKE LOWER('%${x[1]}%')`
            
            return ` AND ${x[0]}='${x[1]}';`
    }).join("")}`;
    
        return await this.popularFKs((await executarSQL(sql)).rows);
    }
    
    async buscarPorID(id: number) {
        const sql = 
`SELECT id, usuid_remetente AS remetente, usuid_destinatario AS destinatario, etiqueta_id, mensagem
    FROM valoriza.elogio
    WHERE id = ${id};`;

        const { rows, rowCount } = await executarSQL(sql);

        if (rowCount === 0)
            return null;

        return await this.popularFKs(rows)[0];
    }
    
    async buscarUm(elogio: IComplimentFindUpdate) {
        elogio = limparObjeto(elogio);

        const sql = 
`SELECT id, usuid_remetente AS remetente, usuid_destinatario AS destinatario, etiqueta_id, mensagem
    FROM valoriza.elogio
    WHERE 1=1 ${Object.entries(elogio).map(x => {
        if (x[1] === "mensagem")
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
        const etiquetaService = new TagService();

        return elogios.map((e) => {
            e.remetente = userServiece.buscarPorID(e.remetente);
            e.destinatario = userServiece.buscarPorID(e.destinatario);
            e.etiqueta = etiquetaService.buscarPorID(e.id);
        })
    }
}

export { ComplimentRepository }