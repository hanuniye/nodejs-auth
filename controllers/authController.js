const userDB = require("../model/users");
const { OK, INTERNAL_SERVER_ERROR, BAD_REQUEST,CONFLICT, NOT_FOUND, UNAUTHORIZED } = require("http-status-codes").StatusCodes;
const ROLES_LIST = require("../config/roles");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const addUser = async (req, res) => {
    const { name, email, password } = req.body;

    if(!name || !email || !password) return res.status(BAD_REQUEST).json({msg: "missing name or email or password"});
    try {
        const existEmail = await userDB.findByEmail(email);
        if(existEmail) return res.status(CONFLICT).json({msg: "this email is existing!!"}); 

        const salt = await bcrypt.genSalt(12);
        const hashPwd = await bcrypt.hash(password, salt)

        const user = await userDB.create({name,email, password: hashPwd, roles: ROLES_LIST.user});
        if(!user) return res.status(BAD_REQUEST).json({msg: "somethig wnet wrong!!"}); 

        res.status(OK).json({user}); 

    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({msg: error.message}); 
    }
}

const getUsers = async (req, res) => {
    try {
        const data = await userDB.find();
        if(!data) return res.status(NOT_FOUND).json({msg: "no resource found!!"});
        
        res.status(OK).json({data});
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({msg: error.message}); 
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    // return res.json({msg: `${email} ${password}`})

    if(!email || !password) return res.status(BAD_REQUEST).json({msg: "missing email or password"});
    try {
        const validEmail = await userDB.findByEmail(email);
        if(!validEmail) return res.status(UNAUTHORIZED).json({msg: "this user does not exist!!"}); 

        const isMatch = await bcrypt.compare(password, validEmail.password);
        if(!isMatch) return res.status(UNAUTHORIZED).json({msg: "password is not match!!"}); 

        const role = validEmail.roles;

       const accessToken = jwt.sign({email: validEmail.email, role: validEmail.roles}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15min"})

       const refreshToken = jwt.sign({email: validEmail.email, role: validEmail.roles}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "1day"});

       const updatedUserByRefr = await userDB.updateById(validEmail.id, {...validEmail, refresh_token:refreshToken});

       res.cookie("jwt", refreshToken, { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000});
       res.status(OK).json({user: validEmail, accessToken, role});
        

    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({msg: error.message}); 
    }
}

module.exports = {
    addUser,
    getUsers,
    login
}