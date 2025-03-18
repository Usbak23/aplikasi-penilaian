
const express = require("express");
const router = express.Router();
const { index } = require("./controller");
const {isLoginAdmin,} =require('../middleware/auth');



router.get("/", isLoginAdmin, index);


module.exports = router;