const scoresModel = require('../models/scores');

exports.users_get =  async (req,res) => {
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