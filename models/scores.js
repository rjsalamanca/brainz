const db = require('./conn.js');

class Scores {
    constructor(id, accuracy, points, user_id, mode_id) {
        this.id = id;
        this.accuracy = accuracy;
        this.points = points;
        this.user_id = user_id;
        this.mode_id = mode_id;
    }

    static async getAllScores() {
        try {
            const response = await db.any(`     
                
        
            `);
            return response;
        } catch(err) {
            return(err.message);
        }
    }
}

module.exports = Scores;