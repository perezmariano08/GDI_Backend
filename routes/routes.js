const express = require('express');
const router = express.Router();
const jugadoresController = require('../controllers/jugadoresController');
const partidosController = require('../controllers/partidosController');
const equiposController = require('../controllers/equiposController');
const { revisarApiKey } = require('../middlewares/auth');

// Jugadores
router.get('/jugadores/:id?', jugadoresController.getJugadores);
router.get('/jugadores/campanas/:id?', jugadoresController.getCampañasJugadores);
router.get('/jugadores/estadisticas/:id?', jugadoresController.getJugadorEstadisticas);

// Partidos
router.get('/partidos/alineaciones/:id?', partidosController.getAlineacionesPartido);
router.get('/partidos/incidencias/:id?', partidosController.getIncidenciasPartido);
router.get('/partidos/goles/:id?', partidosController.getGolesPartido);
router.get('/partidos/cambios/:id?', partidosController.getCambiosPartido);
router.get('/partidos/imagenes/:id?', partidosController.getImagenesPartido);
router.get('/partidos/partidos-campania/:id?', partidosController.getPartidosCampañaPartido);
router.get('/partidos/historial-rival/:id?', partidosController.getPartidosRival);
router.get('/partidos/por-fecha', partidosController.getPartidosAñoMesController);
router.get('/partidos/:id?', partidosController.getPartidos);

// Equipos
router.get('/get-equipos', equiposController.getEquipos);

module.exports = router;
