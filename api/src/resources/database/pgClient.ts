const { Pool } = require('pg')

export default new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'sys',
    database: 'dbGui'
})