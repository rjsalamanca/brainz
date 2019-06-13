var express = require('express');
var router = express.Router();
const db = require('../models/conn.js');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;



router.use(bodyParser.urlencoded({extended: false}));

/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.render('partial-users');
  res.render('template', { 
    locals:{
      title: 'Users Page'
    },
    partials: {
      partial:'partial-users'
    }
  });
});

router.get('/add-user', (req,res) => {
  // res.render('partial-add-user');
  res.render('template', { 
    locals:{
      title: 'Register'
    },
    partials: {
      partial:'partial-add-user'
    }
  });

});


router.get('/login', (req,res) => {
  // res.render('partial-add-user');
  res.render('template', { 
    locals:{
      title: 'Login'
    },
    partials: {
      partial:'partial-login'
    }
  });

});

router.post('/add-user', (req,res) =>{
  let email = req.body.email;
  let password = req.body.password;
  let f_name = req.body.f_name;
  let l_name = req.body.l_name;

  db.oneOrNone('SELECT id FROM users WHERE email = $1', [email])
  .then((user)=> {
    if (user){
      res.redirect('/users/login')
    } else {

      bcrypt.hash(password,SALT_ROUNDS,function(error, hash){
        if(error == null){
          db.none('INSERT INTO users(email, password, f_name, l_name) VALUES($1,$2,$3,$4)',[email,hash,f_name,l_name])
          .then(() => {
            console.log('SUCCESS')
            res.redirect('/users');
        });
        }
      })
    };
  });

  if(req.session){
      req.session.name = email;
      req.session.pass = password;
  };

  console.log(f_name);
  console.log(l_name);
  console.log(email);
  console.log(password);

  
});


router.post('/login', (req,res) =>{
  let email = req.body.email;
  let password = req.body.password;

  db.oneOrNone('SELECT id, password FROM users WHERE email = $1', [email])
  .then((user)=> {
    if (user){
      bcrypt.compare(password,user.password,function(error,result){
        if(result){
          res.redirect('/users')
          console.log('success')
        } else {
          res.redirect('/users/login')
          console.log('wrong password')
        }
      })
    } else {
      res.redirect('/users/login')
      console.log('wrong')
    }
  });

  if(req.session){
      req.session.name = email;
      req.session.pass = password;
  };

});


module.exports = router;
