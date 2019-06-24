const db = require('./conn.js');

class Users{
    constructor(id, l_name, f_name, email, password){
        this.id = id;
        this.l_name = l_name;
        this.f_name = f_name;
        this.email = email;
        this.password = password;
    }

    static async searchUser(email){
        try {
            const response = db.one(`
                SELECT id, password, email, f_name 
                FROM users 
                WHERE email = $1
            `, [email]);
            return response;
        } catch(err) {
            return err.message;
        }
    }
    
    static async addUser(f_name, l_name, email, hashPW){
        try{
            await db.none(`
                INSERT INTO users(f_name, l_name, email, password)
                VALUES($1,$2,$3,$4)`, [f_name, l_name, email, hashPW]);
        } catch(err) {
            return err.message;
        }
    }
}

module.exports = Users;