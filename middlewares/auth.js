const db = require('../utils/db');

// Middleware para revisar la clave de API
async function revisarApiKey(req, res, next) {
    try {
        const apiKey = req.headers['api-key']; // Suponiendo que la clave de API se pasa en el encabezado 'api-key'
        console.log(apiKey);

        if (!apiKey) {
            return res.status(401).send('API key not provided');
        }

        // Uso de async/await con MySQL2
        const [rows] = await db.query('SELECT * FROM api_keys WHERE api_key = ?', [apiKey]);

        if (rows.length === 0) {
            return res.status(401).send('API key not valid');
        }
        req.apiKey = rows[0];  // Almacena la información relacionada con la clave de API en la solicitud
        next(); // Pasa al siguiente middleware o controlador
    } catch (error) {
        console.error('Error in revisarApiKey middleware:', error);
        return res.status(500).send('Internal server error');
    }
}

module.exports = {
    revisarApiKey
};
