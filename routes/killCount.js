const express = require('express'),
    router = express.Router(),
    Kills = require('../models/killCount')

router.get('/', async (req, res, next) => {
    
    const getAllKills = await Kills.getAllKills();
    let totalKills = 0;
    getAllKills.forEach(e => { totalKills += e.kill_count})

    res.render('template', {
        locals: {
            title: '',
            isLoggedIn: req.session.loggedIn,
            allKills: totalKills
        },
        partials: {
            partial:'partial-kills'
        }
    });
});

router.post('/:totalKills', async (req, res, next) => {
    const getAllKills = await Kills.getAllKills();
    const addedKills = getAllKills.reduce((tot,curr) => tot.kill_count + curr.kill_count);
    const { totalKills } = req.params;
    if(totalKills != addedKills){
        res.render('template', { 
            locals: {
                title: '',
                isLoggedIn: req.session.loggedIn,
                allKills: addedKills
            },
            partials: {
                partial:'partial-kills'
            }
        });
    } res.redirect('/killCount')
});

module.exports = router;