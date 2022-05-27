async function connection(query){
    const mysql2 = require('mysql2/promise');
    const conn = await mysql2.createConnection({
        host: process.env.DBHOST,
        user: process.env.USERDB,
        password: process.env.PASSWORDDB,
        database: process.env.DB
    });

    const result = await conn.execute(query);
    await conn.end();
    return result[0];
}


module.exports = {
    connection
}
