const jugadoresService = require('../services/jugadoresService');

const getJugadores = async (req, res) => {
    const { id } = req.params;  // Extraemos el parámetro 'id' de la URL
    
    try {
        if (id) {
            const jugador = await jugadoresService.getJugador(id);
            if (jugador) {
                return res.status(200).json(jugador);
            } else {
                return res.status(404).json({ message: 'Jugador no encontrado' });
            }
        } else {
            const jugadores = await jugadoresService.getJugadores();
            return res.status(200).json(jugadores);
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener los jugadores', error });
    }
};

const getCampañasJugadores = async (req, res) => {
    const { id } = req.params;  // Extraemos el parámetro 'id' de la URL    
    try {
        const jugador = await jugadoresService.getCampañasJugador(id);
        if (jugador) {
            return res.status(200).json(jugador);
        } else {
            return res.status(404).json({ message: 'Jugador no encontrado' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener los jugadores', error });
    }
};

module.exports = {
    getJugadores,
    getCampañasJugadores
};
