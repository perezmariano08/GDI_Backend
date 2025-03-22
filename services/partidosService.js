const db = require('../utils/db');

const getPartidos = async () => {
    const [partidos] = await db.query(`
    SELECT 
        p.id_partido,
        DATE_FORMAT(p.dia, '%d/%m/%Y') AS dia_formateado, -- Formatea la fecha        p.id_equipo_rival,
        p.estadio,
        p.arbitro,
		t.nombre,
        c.temporada,
        p.condicion,
        p.goles_iacc,
        p.goles_rival,
        e.escudo,
        e.nombre AS nombre_equipo,
        CASE 
        WHEN p.condicion = 'V' THEN CONCAT(p.goles_rival, '-', p.goles_iacc)
            ELSE CONCAT(p.goles_iacc, '-', p.goles_rival)
        END AS resultado,
        -- Generamos la ruta respetando el orden de local o visitante
        CASE 
            WHEN p.condicion IN ('L', 'N') THEN CONCAT('instituto-vs-', LOWER(REPLACE(e.nombre, ' ', '-')))
            ELSE CONCAT(LOWER(REPLACE(e.nombre, ' ', '-')), '-vs-instituto')
        END AS ruta_equipos

    FROM partidos p 
    INNER JOIN equipos AS e ON e.id_equipo = p.id_equipo_rival
	INNER JOIN fases AS f ON f.id_fase = p.id_fase	
	INNER JOIN campañas AS c ON c.id_campaña = f.id_campaña	
    INNER JOIN torneos AS t ON t.id_torneo = c.id_torneo
    ORDER BY p.dia DESC`);
    return partidos;
};

const getPartido = async (id) => {
    const [partido] = await db.query(
        `SELECT 
            p.id_partido,
            p.condicion,
            p.dia,
            p.arbitro,
            p.hora,
            p.goles_iacc,
            p.goles_rival,
            p.id_equipo_rival,
            p.dt_iacc,
            p.dt_rival,
            p.estado,
            p.estadio,
            p.id_fase,
            f.fase AS fase,
            t.nombre AS torneo,
            c.temporada,
            e.nombre AS nombre_equipo,
            e.escudo AS escudo_equipo,
            p.jornada,
            CASE 
            WHEN p.condicion IN ('L', 'N') THEN CONCAT('instituto-vs-', LOWER(REPLACE(e.nombre, ' ', '-')))
            ELSE CONCAT(LOWER(REPLACE(e.nombre, ' ', '-')), '-vs-instituto')
        END AS ruta_equipos
        FROM partidos AS p
        INNER JOIN fases AS f ON f.id_fase = p.id_fase
        INNER JOIN campañas AS c ON c.id_campaña = f.id_campaña
        INNER JOIN torneos AS t ON t.id_torneo = c.id_torneo
        INNER JOIN equipos AS e ON e.id_equipo = p.id_equipo_rival
        WHERE id_partido = ?`, [id]);
    return partido.length > 0 ? partido[0] : null;
};

const getAlineacionesPartido = async (id) => {
    const partido = await db.query(`
    SELECT 
        a.id_partido,
        a.id_equipo,
        a.dorsal,
        a.id_jugador,
        a.condicion,
        j.posicion,
        j.nacionalidad,
        COALESCE(CONCAT(j.apellido, ', ', j.nombre), a.jugador) AS nombre_completo
    FROM alineaciones a
    LEFT JOIN jugadores j ON j.id_jugador = a.id_jugador
    WHERE a.id_partido = ?
    ORDER BY a.id_equipo, a.dorsal`, [id]);
    return partido.length > 0 ? partido[0] : null;
};

const getCambiosPartido = async (id) => {
    const partido = await db.query(`
    SELECT 
        c.id_partido,
        c.id_equipo,
        c.id_jugador_entrante,
        c.dorsal_entrante,
        c.jugador_entrante,
        c.id_jugador_saliente,
        c.dorsal_saliente,
        c.jugador_saliente,
        c.minuto,
        j.nombre,
        c.id_equipo,
        j.apellido
    FROM cambios c
    LEFT JOIN jugadores j ON j.id_jugador = c.id_jugador_entrante
    LEFT JOIN jugadores j2 ON j2.id_jugador = c.id_jugador_saliente
    WHERE c.id_partido = ?`, [id]);
    return partido.length > 0 ? partido[0] : null;
};

const getIncidenciasPartido = async (id) => {
    const [partido] = await db.query(`
    CALL sp_obtener_incidencias_partido(?)`, [id]);
    return partido.length > 0 ? partido[0] : null;
};

const getGolesPartido = async (id) => {
    const partido = await db.query(`
    SELECT
        g.id_partido,
        g.id_jugador,
        g.id_equipo,
        g.minuto,
        COALESCE(CONCAT(j.apellido, ', ', j.nombre), g.jugador) AS nombre_completo
    FROM goles g
    LEFT JOIN jugadores j ON j.id_jugador = g.id_jugador
    WHERE g.id_partido = ?`, [id]);
    return partido.length > 0 ? partido[0] : null;
};

module.exports = {
    getPartidos,
    getPartido,
    getAlineacionesPartido,
    getGolesPartido,
    getIncidenciasPartido,
    getCambiosPartido
};
