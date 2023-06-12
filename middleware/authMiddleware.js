const { UNAUTHORIZED,FORBIDDEN } = require("http-status-codes").StatusCodes;
const jwt = require("jsonwebtoken");
const userDB = require("../model/users");

const auth = (req, res, next) => {
    const { auth } = req.headers;
    if(!auth) return res.status(UNAUTHORIZED).json({msg: "missing token!!"});

    const authorazation = auth.split(' ')[1];

    jwt.verify(authorazation, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if(err) return res.status(FORBIDDEN).json({msg: "expired token!!"});
        const user = await userDB.findByEmail(decoded.email);
        if(!user) return res.status(UNAUTHORIZED).json({msg: "this token does not exist"});

        req.user = decoded;
        next();
    })
}

module.exports = auth 