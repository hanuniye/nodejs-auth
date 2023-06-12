const express = require("express");
const router = express.Router();
const {refreshToken} = require("../controllers/refreshController");
const authMiddleWare = require("../middleware/authMiddleware")

router.get("/", refreshToken)

module.exports = router;
