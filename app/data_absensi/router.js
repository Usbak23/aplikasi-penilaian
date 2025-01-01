const express = require("express");
const router = express.Router();
const { index,   } = require("./controller");
// const {isLoginAdministrator} =require('../middleware/auth');

// router.use(isLoginAdministrator);
router.get("/", index);
// router.get("/create", viewCreate);
// router.post("/create", actionCreate);

module.exports = router;
