/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("users", tbl => {
    tbl.increments()
    tbl.string("name")
    tbl.string("email")
    tbl.string("password")
    tbl.string("refresh_token")
    tbl.string("roles")
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("users")
};
