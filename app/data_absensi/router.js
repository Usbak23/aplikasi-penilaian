const express = require("express");
const router = express.Router();
const { index,  scan, viewScan } = require("./controller");
const {isLoginAdmin, isLoginPeserta} =require('../middleware/auth');


router.get("/",isLoginAdmin, index);
router.post("/peserta/scan-barcode", isLoginPeserta, scan);
router.get("/peserta/scan-barcode", isLoginPeserta, viewScan);
// router.post("/create", actionCreate);

module.exports = router;
