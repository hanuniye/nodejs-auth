const db = require("../data/dbConfig");

const create = async (info) => {
    const data = await db("users").insert(info, ["id", "name", "email"]);
    return data;
}

const findByEmail = async (email) => {
    const data = await db("users").where({ email }).first();
    return data;
}

const find = async () => {
    const data = await db("users");
    return data;
}

const updateById = async (id, info) => {
    const data = await db("users").where({id}).update(info);
    return data;
}

const findByRefreshToken = async (refresh_token) => {
    const data = await db("users").where({ refresh_token }).first();
    return data;
}

module.exports = {
    create,
    findByEmail,
    find,
    updateById,
    findByRefreshToken
}