const Absensi = require("./model");

const QRCode = require("qrcode");
const Materi = require("../materi/model");
const path = require("path");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };

      const absensi = await Absensi.find()
      .populate('name_materi', 'materi');

      console.log("absen===>>>>", absensi);

      


      res.render("admin/absensi/view_absen", {
        absensi,
        alert,
        // name_materi: req.session.user.name_materi,
        // role: req.session.user.role,
        title: "Halaman Absensi",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/absensi");
    }
  },
  viewCreate: async (req, res) => {
    try {
      const materiList = await Materi.find(); // Mengambil semua data dari model Materi
      res.render("admin/absensi/create", {
        materiList, // Mengirim data materi ke view
        alert: {
          message: req.flash("alertMessage"),
          status: req.flash("alertStatus"),
        },
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/absensi");
    }
  },
  actionCreate: async (req, res) => {
    const { name_materi, startTime, endTime } = req.body;

    try {
      if (!name_materi || !startTime || !endTime) {
        throw new Error("Semua field harus diisi!");
      }

      const start = new Date(startTime);
      const end = new Date(endTime);

      if (start >= end) {
        throw new Error("End Time harus lebih besar dari Start Time!");
      }

      // Generate QR Code
      const qrData = JSON.stringify({ name_materi, startTime, endTime });
      const qrPath = path.join(
        __dirname,
        "../../public/barcodes",
        `${Date.now()}.png`
      );
      await QRCode.toFile(qrPath, qrData);

      // Simpan ke database
      const absensi = new Absensi({
        name_materi,
        startTime,
        endTime,
        barcodePath: `/barcodes/${path.basename(qrPath)}`,
      });
      console.log('absensi>>>>>>>>', absensi);
      await absensi.save();
      req.flash("alertMessage", "Berhasil Tambah Absensi");
      req.flash("alertStatus", "success");
      res.redirect("/absensi");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/absensi");
    }
  },
};
