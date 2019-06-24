const db = require('./conn.js');

class Users{
    constructor(id, l_name, f_name, email, password){
        this.id = id;
        this.l_name = l_name;
        this.f_name = f_name;
        this.email = email;
        this.password = password;
    }

    async searchUser(){
        try {
            const response = db.one(`
                SELECT id, f_name 
                FROM users 
                WHERE email = $1
            `, [this.email]);
            return response;
        } catch(err) {
            return err.message;
        }
    }
}

module.exports = Users;