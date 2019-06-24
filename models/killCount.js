const db = require('./conn.js');

class Kills{
    constructor(id,kill_count,user_id){
        this.id  = id;
        this.kill_count = kill_count;
        this.user_id = user_id;
    }

    static async getAllKills(){
        try{
            const response = await db.any(`SELECT kill_count FROM kills`)
            console.log(response)
            return response;
        } catch(err) {
            return err.message;
        }
    }

    static async createKills(id){
        try{
            await db.none(
                `INSERT INTO kills
                    (kill_count,user_id)
                VALUES
                    (0, $1)
                `, [id]);
        } catch (err) {
            return err.message;
        }
    }

    async checkKillCount(){
        try{
            const response = await db.one(
                `
                    SELECT kill_count FROM kills
                    WHERE user_id = $1
                `, [this.user_id]
            );
            return response;
        } catch(err) {
            return err.message;
        }
    }

    async addKills(kills){
        try{
            const response = await db.one(
                `
                    UPDATE kills
                    SET kill_count = $1
                    WHERE user_id = $2
                `, [kills, this.user_id]
            )
            return response;
        } catch(err) {
            return err.message;
        }
    }
}

module.exports = Kills;