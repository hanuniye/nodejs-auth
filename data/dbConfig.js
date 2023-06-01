const knex = require("knex");
const db_env = process.env.DB_ENV || "development";
const dbConfig = require("../knexfile")[db_env];
const db = knex(dbConfig);

module.exports = db;