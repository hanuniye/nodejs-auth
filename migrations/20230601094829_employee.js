/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("employees", tbl => {
        tbl.increments()
        tbl.string("name")
        tbl.string("title")
        tbl.string("gender")
        tbl.boolean("status")
      })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("employees");
};
