import { executarSQL, getProximoId } from "../database/pg";
import limparObjeto from "../utils/limparObjeto";

interface IUserInsert {
    nome: string;
    senha: string;
    email: string;
    admin?: boolean;
}

interface IUserFindUpdate {
    nome?: string;
    senha?: string;
    email?: string;
    admin?: boolean;
}

class UserRepository {
    async criar(novoUsuario: IUserInsert) {
        const proximoId = await getProximoId("usuario");

        if (!novoUsuario.admin)
            delete novoUsuario.admin;

        const sql =
`INSERT INTO valoriza.usuario (id, ${Object.keys(novoUsuario).join(', ')})
    VALUES(${proximoId}, '${Object.values(novoUsuario).join(`', '`)}');`;

        await executarSQL(sql);

        delete novoUsuario.senha;

        return {
            id: proximoId,
            ...novoUsuario
        };
    }

    async buscar(usuario: IUserFindUpdate = {}) {
        usuario = limparObjeto(usuario);

        const sql = 
`SELECT id, nome, email, admin
    FROM valoriza.usuario
    WHERE 1=1 ${Object.entries(usuario).map(x => {
        if (x[0] === "admin")
            return ` AND ${x[0]}='${x[1]}'`
        
            return ` AND LOWER(${x[0]}) LIKE LOWER('%${x[1]}%')`
    }).join("")};`;

        return (await executarSQL(sql)).rows;
    }

    async buscarPorID(id: number) {
        const { rows, rowCount } = await executarSQL(`SELECT id, nome, email, admin FROM valoriza.usuario u WHERE u.id = ${id};`);

        if (rowCount === 0)
            return null;

        return rows[0];
    }

    async buscarUm(usuario: IUserFindUpdate, buscaSenha?: boolean) {
        usuario = limparObjeto(usuario);

        const sql = 
`SELECT id, nome, email, admin ${buscaSenha ? ", senha" : ""}
    FROM valoriza.usuario
    WHERE 1=1 ${Object.entries(usuario).map(x => {
        if (x[0] === "admin")
            return ` AND ${x[0]}='${x[1]}'`
        
            return ` AND LOWER(${x[0]}) LIKE LOWER('%${x[1]}%')`
    }).join("")}
    LIMIT 1;`;

        return (await executarSQL(sql)).rows[0];
    }

    async editar(id: number, novoUsuario: IUserFindUpdate) {
        novoUsuario = limparObjeto(novoUsuario);

        if (Object.keys(novoUsuario).length === 0) 
            return {
                id 
            };

        const sql =
`UPDATE valoriza.usuario
    SET ${Object.entries(novoUsuario).map(x => `${x[0]}='${x[1]}'`).join(", ")}, dthr_atualizacao=CURRENT_TIMESTAMP
    WHERE id=${id};`;

        const { rowCount } = await executarSQL(sql);

        if (rowCount === 0)
            return null;
        
        return {
         id,
         ...novoUsuario   
        };
    }

    async remover(id: number) {
        const sql =
`DELETE FROM valoriza.usuario
    WHERE id=${id};`;

        const { rowCount } = await executarSQL(sql);

        return rowCount;
    }
}

export { UserRepository }