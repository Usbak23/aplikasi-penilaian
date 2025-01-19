
const express = require("express");
const router = express.Router();
const { index,  } = require("./controller");
const { isLoginPeserta} =require('../middleware/auth');



router.use(isLoginPeserta);
router.get("/",  index);


module.exports = router;