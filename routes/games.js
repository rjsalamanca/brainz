const express = require('express'),
    router = express.Router(),
    GamesController = require('../controllers/games');

// GETS
router.get('/', GamesController.games_get);
router.get('/:mode', GamesController.games_mode_get);
router.get('/:mode/:difficulty', GamesController.games_mode_difficulty_get);

// POST
router.post('/', GamesController.games_post);
router.post('/:gameMode/:difficulty', GamesController.games_mode_difficulty_post);

module.exports = router;