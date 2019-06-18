const express = require('express'),
    router = express.Router(),
    ScoresController = require('../controllers/scores');

/* /score route */
router.get('/', ScoresController.scores_get);

module.exports = router;