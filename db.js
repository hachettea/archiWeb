const { Pool } = require("pg");

module.exports = class DbManager {
  constructor() {
    this.pool = new Pool({
      user: "uapv1902387",
      host: "127.0.0.1",
      database: "uapv1902387",
      password: "WytD2l",
      port: 5432,
    });
  }

  async getDbInstance() {
    return await this.pool.connect();
  }
};
