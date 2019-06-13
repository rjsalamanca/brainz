const db = require('./conn.js');

class Users {
    constructor(id,email,password,f_name,l_name){
        this.id = id;
        this.email = email;
        this.password = password;
        this.f_name = f_name;
        this.l_name = l_name;
    }

    async checkUser(){
        try{
            const response = db.one(`
                SELECT id FROM users 
                WHERE email = $1
            `, [this.email]);
            return response;
        }catch(err){
            return err.message;
        }
    }
}
module.exports = db;