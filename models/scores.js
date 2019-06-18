const db = require('./conn.js');

class Scores {
    constructor(id, accuracy, points, user_id, mode_id) {
        this.id = id;
        this.accuracy = accuracy;
        this.points = points;
        this.user_id = user_id;
        this.mode_id = mode_id;
    }

    static async getScores(gId) {
        try {
            const response = await db.any(`     
                select s.points, s.accuracy, u.f_name, g.difficulty, g.mode
                from scores as s 
                left join users as u on s.user_id = u.id 
                left join game_modes as g on g.id = s.game_mode_id
                where g.id = $1
                order by points desc limit 10;
                `, [gId]);
            return response;
        } catch(err) {
            return(err.message);
        }
    }

    static async getUserScores(gId, uId) {
        try {
            const response = await db.any(`     
                select s.points, s.accuracy, g.difficulty, g.mode
                from scores as s 
                left join users as u on s.user_id = u.id 
                left join game_modes as g on g.id = s.game_mode_id
                where g.id = $1 and u.id = $2
                order by points desc limit 10;
                `, [gId, uId]);
            return response;
        } catch(err) {
            return(err.message);
        }
    }

    static async getRecentScores(uId) {
        try {
            const response = await db.any(`
                select s.points, s.accuracy, s.id, g.difficulty, g.mode
                from scores as s
                left join users as u on s.user_id = u.id
                left join game_modes as g on g.id = s.game_mode_id
                where u.id = $1
                order by id desc limit 5;
                `, [uId]);
            return response;
        } catch(err) {
            return(err.message);
        }
    }

    static async getAverages(uId) {
        try {
            const response = await db.any(`
                select AVG(points) avg_points, AVG(accuracy) avg_accuracy, g.id, g.difficulty, g.mode 
                from scores as s 
                left join users as u on s.user_id = u.id
                left join game_modes as g on g.id = s.game_mode_id
                where u.id = $1
                group by g.id;
                `, [uId]);
                // console.log(response);
                return response;
        } catch(err) {
            return(err.message);
        }
    }
}

module.exports = Scores;