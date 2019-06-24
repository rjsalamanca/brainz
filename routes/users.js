var express = require('express');
var router = express.Router();
const db = require('../models/conn.js');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;
const Kills = require('../models/killCount');
const Users = require('../models/users');

const usersController = require('../controllers/users');

router.use(bodyParser.urlencoded({extended: false}));

/* GET users listing. */
router.get('/', usersController.users_get);
router.get('/add-user', usersController.add_user_get);
router.get('/login', usersController.login_get);
router.get('/logout', usersController.logout_get);

router.post('/add-user', async (req,res) => {
  const { f_name, l_name, email, password } = req.body;

  try{
    // If we get an error we go to the catch
    // If we don't get an error that means the user already exists
    // We will print an error and tells the user that they already
    // have an account.
    await Users.searchUser(email);

    res.render('template', { 
      locals:{
        isLoggedIn: req.session.loggedIn,
        title: 'Register',
        passwordCheck: false,
        createdUserAlready: true,
        newUser: false,
        noUser: false
      },
      partials: {
        partial:'partial-add-user'
      }
    });
  } catch(err) {
    try{ 

      // Hashes password then adds to the user to the database.
      const hashPassword = await bcrypt.hash(password,SALT_ROUNDS);
      await Users.addUser(f_name, l_name, email, hashPassword);

      // Once we add the password we want the id and add kills to the
      // new kills table/
      const newUser = await Users.searchUser(email);
      await Kills.createKills(newUser.id);

      req.session.newUser = true
      res.redirect('/users/login')
    } catch(err) {
      return err.message;
    }
  }
});


router.post('/login', (req,res) =>{
  let email = req.body.email;
  let password = req.body.password;

  db.oneOrNone('SELECT id, password, email, f_name FROM users WHERE email = $1', [email])
  .then((user)=> {
    if (user){
      bcrypt.compare(password,user.password,function(error,result){
        if(result){
          req.session.loggedIn = true;
          req.session.user = { id: user.id, email: user.email, f_name: user.f_name }
          console.log('we logged in with: ', req.session.user)

          // req.session.welcome = true
          res.redirect('/users')

        } else{
          res.render('template', { 
            locals:{
              isLoggedIn: req.session.loggedIn,
              title: 'Login',
              passwordCheck: true,
              createdUserAlready: false,
              newUser: false,
              noUser: false
            },
            partials: {
              partial:'partial-login'
            }
          });
          //res.redirect('/users/login')
          console.log('wrong password')
        }
      })
    } else {
      res.render('template', { 
        locals:{
          isLoggedIn: req.session.loggedIn,
          title: 'Login',
          createdUserAlready: false,
          newUser: false,
          passwordCheck: false,
          noUser: true
        },
        partials: {
          partial:'partial-login'
        }
      });
      console.log('wrong')
    }
  });
});

module.exports = router;