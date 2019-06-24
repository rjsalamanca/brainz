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
  const userInstance = new Users(null, f_name, l_name, email, password);

  try{
    const search = await userInstance.searchUser();
    console.log(search)
  } catch(err) {
    console.log('not found lets create a new one')
  }
  // let email = req.body.email;
  // let password = req.body.password;
  // let f_name = req.body.f_name;
  // let l_name = req.body.l_name;
  //let userInstance = new Users(null, email,)



  db.oneOrNone('SELECT id, f_name FROM users WHERE email = $1', [email])
  .then((user)=> {
    if (user){
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
    } else {

      bcrypt.hash(password,SALT_ROUNDS,function(error, hash){
        if(error == null){
          db.none('INSERT INTO users(email, password, f_name, l_name) VALUES($1,$2,$3,$4)',[email,hash,f_name,l_name])
          .then(() => {
            console.log('SUCCESS')
            db.one('SELECT id FROM users WHERE email = $1', [email]).then(async (response) => {
              console.log('creating kills')
              await Kills.createKills(response.id);
            });
            req.session.newUser = true
            res.redirect('/users/login')
        });
        }
      })
    };
  });
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