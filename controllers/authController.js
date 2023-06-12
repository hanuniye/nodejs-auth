const userDB = require("../model/users");
const { OK, INTERNAL_SERVER_ERROR, BAD_REQUEST, CONFLICT, NOT_FOUND, UNAUTHORIZED, NO_CONTENT } = require("http-status-codes").StatusCodes;
const ROLES_LIST = require("../config/roles");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const addUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) return res.status(BAD_REQUEST).json({ msg: "missing name or email or password" });
    try {
        const existEmail = await userDB.findByEmail(email);
        if (existEmail) return res.status(CONFLICT).json({ msg: "this email is existing!!" });

        const salt = await bcrypt.genSalt(12);
        const hashPwd = await bcrypt.hash(password, salt)

        const user = await userDB.create({ name, email, password: hashPwd, roles: ROLES_LIST.user });
        if (!user) return res.status(BAD_REQUEST).json({ msg: "somethig wnet wrong!!" });

        res.status(OK).json({ user });

    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
}

const getUsers = async (req, res) => {
    try {
        const data = await userDB.find();
        if (!data) return res.status(NOT_FOUND).json({ msg: "no resource found!!" });

        res.status(OK).json({ data });
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(BAD_REQUEST).json({ msg: "missing email or password" });
    try {
        const validEmail = await userDB.findByEmail(email);
        if (!validEmail) return res.status(UNAUTHORIZED).json({ msg: "this user does not exist!!" });

        const isMatch = await bcrypt.compare(password, validEmail.password);
        if (!isMatch) return res.status(UNAUTHORIZED).json({ msg: "password is not match!!" });

        const role = validEmail.roles;

        const accessToken = jwt.sign({ email: validEmail.email, role: validEmail.roles }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "5s" })

        const refreshToken = jwt.sign({ email: validEmail.email, role: validEmail.roles }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "10s" });

        await userDB.updateById(validEmail.id, { ...validEmail, refresh_token: refreshToken });

        const cookiesOptions = {
            httpOnly: true, //secure can not access in javascript
            sameSite: "Strict", //for development env
            maxAge: 24 * 60 * 60 * 1000,
        }

        if (process.env.DB_ENV === "production") {
            cookiesOptions[sameSite] = "None",
                cookiesOptions[secure] = true
        }

        res.cookie("jwt", refreshToken, cookiesOptions);
        res.status(OK).json({ user: validEmail, accessToken, role });

    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
}

const logout = async (req, res) => {
    const { jwt: refresh_t } = req.cookies;
    if (!refresh_t) return res.status(UNAUTHORIZED).json({ msg: "ooopps!! no refresh_token" });

    try {
        const cookiesOptions = {
            httpOnly: true, //secure can not access in javascript
            sameSite: "Strict", //for development env
        }

        if (process.env.DB_ENV === "production") {
            cookiesOptions[sameSite] = "None",
                cookiesOptions[secure] = true
        }

        const user = await userDB.findByRefreshToken(refresh_t);
        if (!user) {
            res.clearCookie("jwt", cookiesOptions);
            return res.status(NO_CONTENT);
        }

        userDB.updateById(user.id, { ...user, refresh_token: '' });
        res.clearCookie("jwt", cookiesOptions);
        res.status(OK).json({ msg: "deleted seccss!!", email: user.email });
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
}

module.exports = {
    addUser,
    getUsers,
    login,
    logout
}