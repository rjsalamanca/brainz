var express = require('express');
var router = express.Router();

const bodyParser = require('body-parser');

function authenticate(req,res,next){
    if(req.session){
        if(req.session.name){
            next()
        }else{
            res.redirect('/add-user');
        }
    }else{
        res.redirect('/add-user');
    }
};

router.use(bodyParser.urlencoded({extended: false}));

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/add-user', (req,res) => {
  res.render('partial-add-user');

});

router.post('/add-user', (req,res) =>{
  let name = req.body.name;
  let pass = req.body.pass;

  if(req.session){
      req.session.name = name;
      req.session.pass = pass;
  };

  console.log(name);
  console.log(pass);

  res.status(200).send();
});


module.exports = router;
