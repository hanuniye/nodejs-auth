require("dotenv").config()
const userDB = require("../model/users");
const { OK, INTERNAL_SERVER_ERROR, FORBIDDEN, UNAUTHORIZED, NOT_FOUND } = require("http-status-codes").StatusCodes;
const jsonWeb = require("jsonwebtoken");

const refreshToken = async (req, res) => {
    const { jwt } = req.cookies;
    // return res.json({msg: jwt});
    console.log(`jwt: ${jwt}`);
    if(!jwt) return res.status(UNAUTHORIZED).json({msg: "refresh_token is missing!!"});

    try {
        const existRefeshT = await userDB.findByRefreshToken(jwt);
        if(!existRefeshT) return res.status(FORBIDDEN);

        jsonWeb.verify(jwt, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if(err || decoded.email !== existRefeshT.email) return res.status(FORBIDDEN);
            const user = await userDB.findByEmail(decoded.email);
            if(!user) return res.status(NOT_FOUND);

            const accessToken = jsonWeb.sign({email: user.email, role: user.roles}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "5s"});

            res.status(OK).json({accessToken, name: user.email});
        })

    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({msg: error.message}); 
    }
}

module.exports = {refreshToken}