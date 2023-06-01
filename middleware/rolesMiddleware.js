const { UNAUTHORIZED } = require("http-status-codes").StatusCodes;

const roles = (allowedRoles) => {
    return (req, res, next) => {
        const { role } = req.user;

        const rolesArray = [...allowedRoles];
        const result = rolesArray.includes(role);
        if(!result) return res.status(UNAUTHORIZED).json({msg: "unauthorized"});
        next()
    }
}

module.exports = roles 