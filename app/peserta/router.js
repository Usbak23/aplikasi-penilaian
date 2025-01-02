const express = require("express");
const router = express.Router();
const {
  index,
  viewCreate,
  actionCreate,
  viewEdit,
  actionEdit,
  actionUpload,
  actionDelete,
  viewUpload,
} = require("./controller");
const {isLoginAdmin} =require('../middleware/auth')

const multer = require('multer')
const os = require('os')

router.use(isLoginAdmin);
router.get("/", index);
router.get("/create", viewCreate);
router.post("/create", actionCreate);
router.get("/upload", viewUpload);
router.get("/edit/:id", viewEdit);
router.put("/edit/:id", actionEdit);
router.post('/upload', multer({ dest: os.tmpdir() }).single('excelFile'), actionUpload);
router.delete("/delete/:id", actionDelete);

module.exports = router;
