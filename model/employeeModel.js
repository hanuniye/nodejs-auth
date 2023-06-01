const db = require("../data/dbConfig");

const create = async (info) => {
    const data = await db("employees").insert(info, ["id", "name", "title", "gender", "status"]);
    return data;
}

const find = async () => {
    const data = await db("employees");
    return data;
}

const findById = async (id) => {
    const data = await db("employees").where({ id }).first();
    return data;
}

const updateById = async (id, info) => {
    const data = await db("employees").where({id}).update(info);
    if(data) return findById(id)
}

const deleteById = async (id) => {
    const data = await db("employees").where({id}).del();
    return data;
}



module.exports = {
    create,
    find,
    updateById,
    findById,
    deleteById
}