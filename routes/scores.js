const express = require('express'),
    router = express.Router(),
    ScoresController = require('../controllers/scores');

/* GET home page. */
router.get('/', ScoresController.get);
   
module.exports = router;
