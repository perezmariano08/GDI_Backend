const db = require('../utils/db');

const getEquipos = (req, res) => {
    db.query(`
        SELECT 
            *
        FROM 
            equipos`, (err, result) => {
        if (err) {
            console.error('Error en la consulta a la base de datos:', err);
            return res.status(500).send('Error interno del servidor');
        }
        res.send(result);
    });
};

module.exports = {
    getEquipos
};

