const express = require('express');
const router = express.Router();
const jugadoresController = require('../controllers/jugadoresController');

// Esta es la ruta correcta según tu código
router.get('/get-jugadores', jugadoresController.getJugadores);

module.exports = router;
