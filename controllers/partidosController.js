const partidosService = require('../services/partidosService');

const getPartidos = async (req, res) => {
    const { id } = req.params;  // Extraemos el parámetro 'id' de la URL
    
    try {
        if (id) {
            const partido = await partidosService.getPartido(id);
            if (partido) {
                return res.status(200).json(partido);
            } else {
                return res.status(404).json({ message: 'Partido no encontrado' });
            }
        } else {
            const partidos = await partidosService.getPartidos();
            return res.status(200).json(partidos);
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener los partidos', error });
    }
};

const getAlineacionesPartido = async (req, res) => {
    const { id } = req.params;  // Extraemos el parámetro 'id' de la URL    
    try {
        const partido = await partidosService.getAlineacionesPartido(id);
        if (partido) {
            return res.status(200).json(partido);
        } else {
            return res.status(404).json({ message: 'Alineacion no encontrada' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener las alineaciones', error });
    }
};

const getCambiosPartido = async (req, res) => {
    const { id } = req.params;  // Extraemos el parámetro 'id' de la URL    
    try {
        const partido = await partidosService.getCambiosPartido(id);
        if (partido) {
            return res.status(200).json(partido);
        } else {
            return res.status(404).json({ message: 'Cambios no encontrados' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener los cambios', error });
    }
};

const getIncidenciasPartido = async (req, res) => {
    const { id } = req.params;  // Extraemos el parámetro 'id' de la URL    
    try {
        const partido = await partidosService.getIncidenciasPartido(id);
        if (partido) {
            return res.status(200).json(partido);
        } else {
            return res.status(404).json({ message: 'incidencias no encontradas' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener las incidencias', error });
    }
};

const getGolesPartido = async (req, res) => {
    const { id } = req.params;  // Extraemos el parámetro 'id' de la URL    
    try {
        const partido = await partidosService.getGolesPartido(id);
        if (partido) {
            return res.status(200).json(partido);
        } else {
            return res.status(404).json({ message: 'Goles no encontrados' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener los goles', error });
    }
};



module.exports = {
    getPartidos,
    getAlineacionesPartido,
    getGolesPartido,
    getIncidenciasPartido,
    getCambiosPartido
};
