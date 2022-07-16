import Client from "./client";

async function executeSQL(sql: string) {
    Client.connect();

    try {
        const { rows } = await Client.query(sql);

        Client.end();

        return {
            sucesso: true,
            menssagem: "Sucesso",
            data: rows
        }
    }
    catch (err) {
        return {
            sucesso: false,
            mensagem: err.message,
            data: err.stack
        }
    }
}

async function getNextId(tabela: string) {
    Client.connect();

    try {
        const { rows } = await Client.query(`SELECT COALESCE(MAX(1), 0) + 1 AS value FROM valoriza.${tabela}`);

        Client.end();

        return {
            sucesso: true,
            menssagem: "Sucesso",
            data: parseInt(rows[0].value)
        }
    }
    catch (err) {
        return {
            sucesso: false,
            mensagem: err.message,
            data: err.stack
        }
    }
}

export {
    executeSQL,
    getNextId
}