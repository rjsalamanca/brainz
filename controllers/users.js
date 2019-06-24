const Users = require('../models/users'),
  scoresModel = require('../models/scores'),
  bcrypt = require('bcryptjs'),
  SALT_ROUNDS = 10;

//////////
// GETS //
//////////

exports.users_get =  async (req,res) => {
  if(!!req.session.loggedIn){
    const easyRegScores = await scoresModel.getUserScores(1, req.session.user.id),
        medRegScores = await scoresModel.getUserScores(2, req.session.user.id),
        hardRegScores = await scoresModel.getUserScores(3, req.session.user.id),
        recentScores = await scoresModel.getRecentScores(req.session.user.id),
        averageScores = await scoresModel.getAverages(req.session.user.id),
        welcome = [`Fear ${req.session.user.f_name}, The Zombie Slayer`, 
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
        locals: {
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
  } else {
    res.redirect('/users/login');
  }
}

exports.add_user_get = async (req,res) => {
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
}

exports.login_get = (req,res) => {
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
}

exports.logout_get = (req,res) => {
    req.session.destroy();
    res.redirect('/');
}

///////////
// POSTS //
///////////

exports.add_user_post = async (req,res) => {
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
}

exports.login_post = async (req,res) => {
  const { email, password } = req.body;

  try{
    const currentUser = await Users.searchUser(email);
    const comparePassword = await bcrypt.compare(password,currentUser.password);

    if(!!comparePassword){
      req.session.loggedIn = true;
      req.session.user = { id: currentUser.id, email: currentUser.email, f_name: currentUser.f_name };
      res.redirect('/users');
    } else {
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
      console.log('Wrong password')
    }
  } catch (err) {
    console.log(err.message)
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

    console.log('User not found in database.')    
  }
}