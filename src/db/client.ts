const { Client } = require('pg')

export default new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'sys',
    database: 'dbGui'
})