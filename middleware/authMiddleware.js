const { UNAUTHORIZED } = require("http-status-codes").StatusCodes;
const jwt = require("jsonwebtoken");
const userDB = require("../model/users");

const auth = (req, res, next) => {
    const { auth } = req.headers;
    console.log(auth);
    if(!auth) return res.status(UNAUTHORIZED).json({msg: "missing token!!"});

    jwt.verify(auth, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if(err) return res.status(UNAUTHORIZED).json({msg: "unknow token!!"})
        const user = await userDB.findByEmail(decoded.email);
        if(!user) return res.status(UNAUTHORIZED).json({msg: "this token does not exist"});

        req.user = decoded;
        next();
    })
}

module.exports = auth 