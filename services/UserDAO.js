const DbManager = require("../db")

module.exports = class UserDAO extends DbManager {
    
    constructor() {
        super();
    }


    verifyUser(username, password) {
        return new Promise((resolve, reject) => {
            this.getDbInstance().then((db) => {
                db.query('select * from users where username = $1 and password = $2', [username, password])
                .then((res) => {
                    resolve(res.rows[0]);
                    db.release();
                })
                .catch(e => {
                    reject(e);
                    db.release();
                })
            }).catch(() => {
                reject('Error while connecting to the database');
            })
        }) 
    }
}