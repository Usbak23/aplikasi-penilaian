const express = require("express");
const router = express.Router();
const { index, viewCreate, actionCreate } = require("./controller");
const {isLoginAdmin} =require('../middleware/auth');


router.use(isLoginAdmin);
router.get("/",  index);
router.get("/create",  viewCreate);
router.post("/create",  actionCreate);


module.exports = router;