const { Pool } = require('pg');       //@ https://node-postgres.com/
const format = require('pg-format');  //@ https://www.npmjs.com/package/pg-format
const util = require('util');
const { database } = require('../config');


const pool = new Pool({
  host: database.host,
  port: database.port,
  user: database.user,
  password: database.pwd,
  database: database.db,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.query = util.promisify(pool.query);
pool.format = format;


module.exports = pool;
