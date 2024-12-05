const db = require('../utils/db');

const getJugadores = (req, res) => {
    db.query(`
        SELECT 
            *
        FROM 
            Jugadores`, (err, result) => {
        if (err) {
            console.error('Error en la consulta a la base de datos:', err);
            return res.status(500).send('Error interno del servidor');
        }
        res.send(result);
    });
};

module.exports = {
    getJugadores
};

