import Client from "./pgClient";

async function executarSQL(sql: string) {

    try {
        const { rows, rowCount } = await Client.query(sql);

        return { rows, rowCount }
    }
    catch (err) {
        throw new Error(err.message);
    }
}

async function getProximoId(tabela: string) {

    try {
        const { rows } = await Client.query(`SELECT COALESCE(MAX(id), 0) + 1 AS value FROM valoriza.${tabela}`);

        return parseInt(rows[0].value);
    }
    catch (err) {
        throw new Error(err.message);
    }
    
}

export {
    executarSQL,
    getProximoId
}