import { executarSQL, getProximoId } from "../database/pg";
import toPascaCase from "../utils/toPascalCase";

interface IUserInsert {
    nome: string;
    email: string;
    admin?: boolean;
}

interface IUserFindUpdate {
    nome?: string;
    email?: string;
    admin?: boolean;
}

class UserRepository {
    async criar(novoUsuario: IUserInsert) {
        const proximoId = await getProximoId("usuario");

        novoUsuario.nome = toPascaCase(novoUsuario.nome);
        novoUsuario.email = novoUsuario.email.toLocaleLowerCase();
        if (!novoUsuario.admin)
            delete novoUsuario.admin;

        const sql =
`INSERT INTO valoriza.usuario (id, ${Object.keys(novoUsuario).join(', ')})
    VALUES(${proximoId}, '${Object.values(novoUsuario).join(`', '`)}');`;

        await executarSQL(sql);

        return {
            id: proximoId,
            nome: novoUsuario.nome,
            email: novoUsuario.email,
            admin: novoUsuario.admin
        }
    }

    async buscar(usuario: IUserFindUpdate = {}) {
        const sql = 
`SELECT id, nome, email, admin
    FROM valoriza.usuario
    WHERE 1=1 ${Object.entries(usuario).map(x => {
        if (x[1] === "admin")
            return ` AND ${x[0]}='${x[1]}'`
        
            return ` AND LOWER(${x[0]}) LIKE LOWER('%${x[1]}%')`
    }).join("")}`;

        return executarSQL(sql);
    }

    async buscarPorID(id: number) {
        const { rows, rowCount } = await executarSQL(`SELECT 1 AS value FROM valoriza.usuario u WHERE u.id = ${id}`)

        if (rowCount === 0)
            throw new Error("Usuário não encontrado");

        return rows[0];

    }

    async buscarUm(usuario: IUserFindUpdate = {}) {
        const sql = 
`SELECT id, nome, email, admin
    FROM valoriza.usuario
    WHERE 1=1 ${Object.entries(usuario).map(x => {
        if (x[1] === "admin")
            return ` AND ${x[0]}='${x[1]}'`
        
            return ` AND LOWER(${x[0]}) LIKE LOWER('%${x[1]}%')`
    }).join("")}
    LIMIT 1;`;

        return executarSQL(sql);
    }

    async remover(id: number) {
        const sql =
`DELETE FROM valoriza.usuario
    WHERE id=${id};`;

        const { rowCount } = await executarSQL(sql);

        if (rowCount === 0)
            throw new Error("Usuário não encontrado");

        return rowCount;
    }

    async atualizar(id: number, novoUsuario: IUserFindUpdate) {
        const sql =
`UPDATE valoriza.usuario
    SET ${Object.entries(novoUsuario).map(x => `${x[0]}='${x[1]}'`).join(", ")}, dthr_atualizacao=CURRENT_TIMESTAMP
    WHERE id=${id};`;

        const { rowCount } = await executarSQL(sql);

        if (rowCount === 0)
            throw new Error("Usuário não encontrado");

        return {
         id,
         ...novoUsuario   
        };
    }
}

export { UserRepository }