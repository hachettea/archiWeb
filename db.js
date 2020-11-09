const {Pool} = require('pg')

module.exports = class DbManager {
    
    constructor() {
        this.pool = new Pool({
            user: 'alexuser',
            host: 'localhost',
            database: 'alexdb',
            password: 'alexpwd',
            port: 5432
        });
    }

    async getDbInstance() {
        return await this.pool.connect();
    }
}