const express = require("express");
const router = express.Router();
const { addUser, getUsers, login, logout } = require("../controllers/authController");

router.get("/", getUsers)
router.post("/", addUser)
router.post("/login", login)
router.get("/logout", logout)

module.exports = router;
