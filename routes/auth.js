const express = require("express");
const router = express.Router();
const { addUser, getUsers, login } = require("../controllers/authController");
const { auth } = require('../middleware/authMiddleware')

router.get("/", getUsers)
router.post("/", addUser)
router.post("/login", login)

module.exports = router;
