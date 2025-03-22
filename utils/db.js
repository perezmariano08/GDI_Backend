const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    connectionLimit: 20,    // Número máximo de conexiones simultáneas
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectTimeout: 60000,   // Timeout para establecer la conexión
});

pool.on('connection', function (connection) {
    console.log('DB Connection established');

    connection.on('error', function (err) {
        console.error(new Date(), 'MySQL error', err.code);
    });
    connection.on('close', function (err) {
        console.error(new Date(), 'MySQL close', err);
    });
});

function handleDisconnect() {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error conectando a la base de datos:', err);
            setTimeout(handleDisconnect, 2000); // Reintentar conexión después de 2 segundos
        } else {
            console.log('Conexión exitosa a la base de datos');
            if (connection) connection.release();
        }
    });

    pool.on('error', (err) => {
        console.error('Database error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect(); // Reintentar conexión si se pierde la conexión
        } else {
            throw err;
        }
    });
}

handleDisconnect();

module.exports = pool;
