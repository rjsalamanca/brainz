const chai = require('chai'),
    expect = chai.expect,
    chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised).should();

const Games = require('../models/games');

describe('Games model tests:', () =>{
    it('Should get an object of game mode and difficulty is valid', async () => {
        const gameInstance = new Games('regular','easy');
        const getsObjModeDiff = await gameInstance.isGameMode();
        expect(getsObjModeDiff).to.be.an('object');
    });

    it('test', async () => {
        const checkAdd = await Games.addScore('80','1000','1','1');
        expect(checkAdd).to.not.be.an('undefined')
    });
});