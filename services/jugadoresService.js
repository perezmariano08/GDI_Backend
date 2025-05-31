const db = require('../utils/db');

const getJugadores = async () => {
    const [jugadores] = await db.query('SELECT * FROM jugadores ORDER BY apellido');
    return jugadores;
};

const getJugador = async (id) => {
    const [jugador] = await db.query(`
        SELECT
            id_jugador,
            nombre,
            apellido,
            posicion,
            fecha_nacimiento,
            ciudad,
            provincia,
            nacionalidad,
            src
        FROM 
            jugadores
        WHERE 
            id_jugador = ?`, [id]);
    return jugador.length > 0 ? jugador[0] : null;
};

const getCampañasJugador = async (id) => {
    const jugador = await db.query(`SELECT 
    CONCAT(t.nombre, " ", c.temporada) as torneo,    -- Nombre del torneo
    p.id_fase,             -- ID de la fase (si lo necesitas)
    p.dorsal,              -- Número de dorsal del jugador en ese torneo
    p.pj AS partidos_jugados,
    p.g AS goles,
    p.exp AS expulsiones
FROM 
    planteles p
JOIN 
    campañas c ON p.id_campaña = c.id_campaña  -- Relación entre planteles y campañas
JOIN 
    torneos t ON c.id_torneo = t.id_torneo    -- Relación entre campañas y torneos
WHERE 
    p.id_jugador = ?       -- Sustituye '?' por el ID del jugador
ORDER BY 
    c.temporada ASC;`, [id]);
    return jugador.length > 0 ? jugador[0] : null;
};

const getJugadorEstadisticas = async (id) => {
    const [jugador] = await db.query
    (
        `CALL sp_obtener_estadisticas_jugador(?)`, [id]
    );
    return jugador.length > 0 ? jugador[0] : null;
};

module.exports = {
    getJugadores,
    getJugador,
    getJugadorEstadisticas,
    getCampañasJugador
};
