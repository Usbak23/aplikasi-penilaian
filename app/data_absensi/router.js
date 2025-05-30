const express = require("express");
const router = express.Router();
const { index, actionCreate, viewCreate  } = require("./controller");
const {isLoginAdmin, } =require('../middleware/auth');


router.get("/",isLoginAdmin, index);
router.post("/create",isLoginAdmin, actionCreate);
router.get("/create", isLoginAdmin, viewCreate);


module.exports = router;
// router.post("/peserta/scan-barcode", isLoginPeserta, scan);
// router.get("/peserta/scan-barcode", isLoginPeserta, viewScan);
