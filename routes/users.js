const express = require('express'),
  router = express.Router();

const usersController = require('../controllers/users');

/* GET users listing. */
router.get('/', usersController.users_get);
router.get('/add-user', usersController.add_user_get);
router.get('/login', usersController.login_get);
router.get('/logout', usersController.logout_get);

/* POST ysers listing */
router.post('/add-user', usersController.add_user_post);
router.post('/login', usersController.login_post);

module.exports = router;