var express = require('express');
var router = express.Router();
const db = require('../models/conn.js');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;
const Kills = require('../models/killCount');

const scoresModel = require('../models/scores.js');

router.use(bodyParser.urlencoded({extended: false}));

/* GET users listing. */
router.get('/', async (req, res, next) => {
  const easyRegScores = await scoresModel.getUserScores(1, req.session.user.id);
  const medRegScores = await scoresModel.getUserScores(2, req.session.user.id);
  const hardRegScores = await scoresModel.getUserScores(3, req.session.user.id);

  const recentScores = await scoresModel.getRecentScores(req.session.user.id);
  const averageScores = await scoresModel.getAverages(req.session.user.id);
  
  const welcome = [`Fear ${req.session.user.f_name}, The Zombie Slayer`, 
                  `Bow Down to ${req.session.user.f_name}`,
                  `${req.session.user.f_name} The killer of a million zombies`,
                  `Oh F*$@ It's ${req.session.user.f_name}`,
                  `Oh man it's ${req.session.user.f_name} again`,
                  `Hey ${req.session.user.f_name} don't forget to double tap`,
                  `${req.session.user.f_name} is training to be the next star of Zombieland`,
                  `World War Z's got nothing on ${req.session.user.f_name}`,
                  `Fear the Walking Dead? ${req.session.user.f_name} definitely does not.`,
                  `If ${req.session.user.f_name} was on the walking dead, there wouldn't be any zombies left.`,
                  `What has the Zombiepocalypse got on ${req.session.user.f_name}?`,
                  `Hey ${req.session.user.f_name}, how would you kill a zombie with toilet paper?`];
  
  res.render('template', { 
    locals:{
      isLoggedIn: req.session.loggedIn,
      welcome: welcome[Math.floor(Math.random() * welcome.length-1)+1],
      title: 'Users Page',
      easy: easyRegScores,
      med: medRegScores,
      hard: hardRegScores,
      recent: recentScores,
      average: averageScores
    },
    partials: {
      partial:'partial-users'
    }
  });
});

router.get('/add-user', (req,res) => {
  // res.render('partial-add-user');
  console.log(req.session.user)

  res.render('template', { 
    locals:{
      isLoggedIn: req.session.loggedIn,
      title: 'Register',
      emailCheck: false,
      createdUserAlready: false
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
      isLoggedIn: req.session.loggedIn,
      title: 'Login',
      passwordCheck: false,
      createdUserAlready: false,
      newUser: req.session.newUser,
      noUser: false
    },
    partials: {
      partial:'partial-login'
    }
  });

});

router.get('/logout', (req,res) =>{
  console.log('logging out');
  req.session.destroy();
  res.redirect('/');
});

router.post('/add-user', (req,res) =>{
  let email = req.body.email;
  let password = req.body.password;
  let f_name = req.body.f_name;
  let l_name = req.body.l_name;
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
      // res.redirect('/users/login');
    };
  });

  console.log(f_name);
  console.log(l_name);
  console.log(email);
  console.log(password);

  
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