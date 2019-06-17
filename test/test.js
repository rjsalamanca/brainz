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


// describe('Users model tests', () => {
//     // Given an email addres, do we get a user object in return
//     it('should be a valid user object', async () => {
//         const userInstance = new User(null, null, null, 'derp@mcderp.com', null);
//         const theUser = await userInstance.getUserByEmail();
//         console.log(theUser)
//         expect(theUser).to.be.an('object');
//     });

//     it('should NOT be undefined', async () => {
//         const userInstance = new User(null, null, null, 'derp@mcderp.com', null);
//         const theUser = await userInstance.getUserByEmail();
//         expect(theUser.id).to.not.be.an('undefined');
//     });
    
//     it('should get a list of all users', async () => {
//         const allUsers = await User.getAllUsers();
//         expect(allUsers).to.not.be.an('undefined');
//     })
// })

// Write a function to make this test pass...
//describe('Parks model tests', async () => {
//     it('should return a valid park instance', async () => {
//         const thePark = await Parks.getById(1);
//         thePark.should.be.an.instanceOf(Parks);
//     })
// });