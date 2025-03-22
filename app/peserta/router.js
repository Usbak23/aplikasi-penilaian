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
  actionLogout,
  actionUploadTugas
} = require("./controller");
const {isLoginAdmin, isLoginPeserta} =require('../middleware/auth')
const upload = require('../middleware/upload');

const multer = require('multer')
const os = require('os')


router.get("/", isLoginAdmin, index);
router.get("/create", isLoginAdmin,viewCreate);
router.post("/create",isLoginAdmin, actionCreate);
router.get("/upload",isLoginAdmin, viewUpload);
router.get("/edit/:id",isLoginAdmin, viewEdit);
router.put("/edit/:id",isLoginAdmin, actionEdit);
router.post('/upload', isLoginAdmin,multer({ dest: os.tmpdir() }).single('excelFile'), actionUpload);
router.delete("/delete/:id",isLoginAdmin, actionDelete);
router.get("/logout",isLoginPeserta, actionLogout);
router.post("/upload/tugas", isLoginPeserta, upload.single('file'), actionUploadTugas);

module.exports = router;
