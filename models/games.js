const db = require('./conn.js');

class Game{
    constructor(mode,difficulty){
        this.mode = mode;
        this.difficulty = difficulty;
    }

    async isGameMode(){
        try{
            const response = await db.one(
                `
                    SELECT * FROM game_modes 
                    WHERE mode = $1 AND difficulty = $2
                `, [this.mode, this.difficulty]
            ) ;
            return response;
        } catch(err) {
            return err.message;
        }
    }

    static async addScore(accuracy, points, userID, gameModeID){
        try{
            const response = await db.one(
                `
                    INSERT INTO scores 
                        (accuracy, points, user_id, game_mode_id)
                    VALUES
                        ($1,$2,$3,$4)
                `, [accuracy, points, userID, gameModeID]
            );
            return response;
        } catch(err) { 
            return err.message;
        }
    }
}

module.exports = Game;