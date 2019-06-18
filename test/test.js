const chai = require('chai'),
    expect = chai.expect,
    chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised).should();

const Games = require('../models/games');
const Kills = require('../models/killCount');

describe('Games model tests:', () =>{
    it('Should get an object of game mode and difficulty is valid', async () => {
        const gameInstance = new Games('regular','easy');
        const getsObjModeDiff = await gameInstance.isGameMode();
        expect(getsObjModeDiff).to.be.an('object');
    });

    it('Adding a score shouldnt be undefined', async () => {
        const checkAdd = await Games.addScore('80','1000','1','1');
        expect(checkAdd).to.not.be.an('undefined')
    });
});

describe('Kills model tests:', () => {
    it('Should be able to get kills', async () => {
        const killsInstance = new Kills(null,null,1)
        const getKills = await killsInstance.checkKillCount();
        expect(getKills).to.be.an('object');
    });
});