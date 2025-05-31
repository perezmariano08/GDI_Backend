const db = require('../utils/db');

const getPartidos = async () => {
    const [partidos] = await db.query(`
    SELECT 
        p.id_partido,
        DATE_FORMAT(p.dia, '%d/%m/%Y') AS dia_formateado,
        es.nombre AS estadio,
        CONCAT(a.apellido,", ",a.nombre) AS arbitro,
		t.nombre as torneo,
        p.estado,
        c.temporada,
        p.condicion,
        el.nombre as equipo_local,
        ev.nombre as equipo_visita,
        p.goles_local,
        p.goles_visita,
        p.penales_local,
        p.penales_visita,
        el.escudo as escudo_local,
        ev.escudo as escudo_visita,
        YEAR(p.dia) as año,
        MONTH(p.dia) as mes

    FROM partidos p 
    INNER JOIN equipos AS el ON el.id_equipo = p.id_equipo_local
    INNER JOIN equipos AS ev ON ev.id_equipo = p.id_equipo_visita
	INNER JOIN fases AS f ON f.id_fase = p.id_fase	
	INNER JOIN campañas AS c ON c.id_campaña = f.id_campaña	
    INNER JOIN torneos AS t ON t.id_torneo = c.id_torneo
    LEFT JOIN entrenadores AS en ON en.id_entrenador = p.id_entrenador
    LEFT JOIN arbitros AS a ON a.id_arbitro = p.id_arbitro
    LEFT JOIN estadios AS es ON es.id_estadio = p.id_estadio
    WHERE p.dia IS NOT NULL
    ORDER BY p.dia ASC;`);
    return partidos;
};

const getPartidosAñoMes = async (temporada, mes) => {    
    const [partidos] = await db.query(`
    SELECT 
        p.id_partido,
        DATE_FORMAT(p.dia, '%d/%m/%Y') AS dia_formateado,
        es.nombre AS estadio,
        CONCAT(a.apellido,", ",a.nombre) AS arbitro,
		t.nombre as torneo,
        p.estado,
        c.temporada,
        p.condicion,
        el.nombre as equipo_local,
        ev.nombre as equipo_visita,
        p.goles_local,
        p.goles_visita,
        p.penales_local,
        p.penales_visita,
        el.escudo as escudo_local,
        ev.escudo as escudo_visita,
        YEAR(p.dia) as año,
        MONTH(p.dia) as mes

    FROM partidos p 
    INNER JOIN equipos AS el ON el.id_equipo = p.id_equipo_local
    INNER JOIN equipos AS ev ON ev.id_equipo = p.id_equipo_visita
	INNER JOIN fases AS f ON f.id_fase = p.id_fase	
	INNER JOIN campañas AS c ON c.id_campaña = f.id_campaña	
    INNER JOIN torneos AS t ON t.id_torneo = c.id_torneo
    LEFT JOIN entrenadores AS en ON en.id_entrenador = p.id_entrenador
    LEFT JOIN arbitros AS a ON a.id_arbitro = p.id_arbitro
    LEFT JOIN estadios AS es ON es.id_estadio = p.id_estadio
    WHERE YEAR(dia) = ? AND MONTH(dia) = ?;`, [temporada, mes]);
    return partidos;
};

const getPartido = async (id) => {
    const [partido] = await db.query(
        `SELECT 
            p.id_partido,
            DATE_FORMAT(p.dia, '%d/%m/%Y') AS dia_formateado,
            p.dia,
            es.nombre AS estadio,
            CONCAT(a.apellido,", ",a.nombre) AS arbitro,
            t.nombre as torneo,
            p.jornada,
            p.interzonal,
            p.estado,
            c.temporada,
            f.torneo as nombre_torneo,
            p.condicion,
            el.nombre as equipo_local,
            ev.nombre as equipo_visita,
            p.goles_local,
            p.goles_visita,
            p.penales_local,
            p.penales_visita,
            el.escudo as escudo_local,
            ev.escudo as escudo_visita,
            el.id_equipo as id_equipo_local,
            ev.id_equipo as id_equipo_visita,
            YEAR(p.dia) as año,
            MONTH(p.dia) as mes,
            CONCAT(en.apellido, ', ',en.nombre) as dt_iacc,
            p.dt_rival,
            f.sub_torneo,
            f.fase
        FROM partidos p 
        INNER JOIN equipos AS el ON el.id_equipo = p.id_equipo_local
        INNER JOIN equipos AS ev ON ev.id_equipo = p.id_equipo_visita
        INNER JOIN fases AS f ON f.id_fase = p.id_fase	
        INNER JOIN campañas AS c ON c.id_campaña = f.id_campaña	
        INNER JOIN torneos AS t ON t.id_torneo = c.id_torneo
        INNER JOIN entrenadores AS en ON en.id_entrenador = p.id_entrenador
        INNER JOIN arbitros AS a ON a.id_arbitro = p.id_arbitro
        INNER JOIN estadios AS es ON es.id_estadio = p.id_estadio
        WHERE p.id_partido = ?;`, [id]);
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
        j.src,
        -- Si existe id_jugador, se usan los datos de jugadores, si no, se divide lo que hay en 'jugador'
        COALESCE(j.apellido, SUBSTRING_INDEX(a.jugador, ', ', 1)) AS apellido,
        COALESCE(j.nombre, SUBSTRING_INDEX(a.jugador, ', ', -1)) AS nombre
    FROM alineaciones a
    LEFT JOIN jugadores j ON j.id_jugador = a.id_jugador
    WHERE a.id_partido = ?
    ORDER BY a.id_equipo, a.dorsal;
    `, [id]);
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

const getImagenesPartido = async (id) => {
    const partido = await db.query(`
    SELECT 
    p.id_partido,
    CONCAT(
        YEAR(p.dia), '/',               -- Año del partido
        DATE_FORMAT(p.dia, '%Y-%m-%d'), -- Fecha en formato año-mes-día
        '_', p.id_partido, '/',         -- ID del partido
        i.src                           -- Nombre de la imagen en la base de datos
    ) AS src,
    p.dia,
    i.descripcion
FROM 
    partidos_imagenes i
LEFT JOIN 
    partidos p ON p.id_partido = i.id_partido
WHERE 
    p.id_partido = ?;
`, [id]);
    return partido.length > 0 ? partido[0] : null;
};

const getPartidosCampañaPartido = async (id) => {
    const partido = await db.query(`
    SELECT 
        p.id_partido, 
        p.dia, 
        p.id_fase, 
        f.fase,
        c.id_campaña,
        t.nombre AS torneo,
        c.temporada,
        p.jornada,
        p.goles_local,
        p.goles_visita,
        el.id_equipo as id_equipo_local,
        el.nombre as equipo_local,
        el.escudo as escudo_local,
        ev.id_equipo as id_equipo_visita,
        ev.nombre as equipo_visita,
        ev.escudo as escudo_visita,
        p.interzonal
        
    FROM 
        partidos p
    INNER JOIN fases f ON p.id_fase = f.id_fase
    INNER JOIN campañas c ON f.id_campaña = c.id_campaña
    INNER JOIN torneos AS t ON t.id_torneo = c.id_torneo
    INNER JOIN equipos AS el ON el.id_equipo = p.id_equipo_local
    INNER JOIN equipos AS ev ON ev.id_equipo = p.id_equipo_visita
    WHERE 
        c.id_campaña = (
            SELECT c2.id_campaña 
            FROM partidos p2
            JOIN fases f2 ON p2.id_fase = f2.id_fase
            JOIN campañas c2 ON f2.id_campaña = c2.id_campaña
            WHERE p2.id_partido = ?
        )
    ORDER BY
        p.dia IS NULL,  -- Primero ordena los partidos con fecha (p.dia no NULL)
        p.dia;

`, [id]);
    return partido.length > 0 ? partido[0] : null;
};


const getPartidosRival = async (id) => {
    const partido = await db.query(`
    SELECT 
        p.id_partido,
        p.condicion,
        p.dia,
        p.hora,
        p.estado,
        p.id_fase,
        f.fase AS fase,
        t.nombre AS torneo,
        c.temporada,
        p.jornada,
        CASE 
            WHEN
                (p.condicion IN ('L', 'N') AND p.goles_local > p.goles_visita) OR 
                (p.condicion = 'V' AND p.goles_visita > p.goles_local) THEN 'G'
            WHEN 
                (p.condicion IN ('L', 'N') AND p.goles_local < p.goles_visita) OR 
                (p.condicion = 'V' AND p.goles_visita < p.goles_local) THEN 'P'
            ELSE 'E'
        END AS resultado
    FROM partidos AS p
    INNER JOIN fases AS f ON f.id_fase = p.id_fase
    INNER JOIN campañas AS c ON c.id_campaña = f.id_campaña
    INNER JOIN torneos AS t ON t.id_torneo = c.id_torneo
    WHERE p.id_equipo_local = ? OR p.id_equipo_visita = ?`, [id, id]);
    return partido.length > 0 ? partido[0] : null;
};

module.exports = {
    getPartidos,
    getPartido,
    getAlineacionesPartido,
    getGolesPartido,
    getIncidenciasPartido,
    getCambiosPartido,
    getImagenesPartido,
    getPartidosCampañaPartido,
    getPartidosRival,
    getPartidosAñoMes
};
