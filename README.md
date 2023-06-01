## AUTHENTICATION AND AUTHORIZATION WITH NODEJS AND EXPRESS

## create user table in databse 

## exports.up = function(knex) {
## return knex.schema.createTable("users", tbl => {
## tbl.increments()
## tbl.string("name")
## tbl.string("email")
## tbl.string("password")
## tbl.string("refresh_token")
## tbl.string("roles")
## })
## };