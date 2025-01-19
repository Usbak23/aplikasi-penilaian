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
      .populate('name_materi','materi');


      res.render("admin/absensi/view_absen", {
        absensi,
        alert,
        name: req.session.user.name,
        // role: req.session.user,
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
        materiList, 
        title: "Halaman Tambah Absensi",
        name: req.session.user.name,
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

  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const absensi = await Absensi.findOne({ _id: id });
      res.render("admin/absensi/edit", {
        absensi,
        name: req.session.user.name,
        // role: req.session.user,
        title: "Halaman Ubah Absensi",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/absensi");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { name_materi, startTime, endTime } = req.body;
      const absensi = await Absensi.findOne({ _id: id });
      absensi.name = name_materi;
      absensi.startTime = startTime;
      absensi.endTime = endTime;
      await absensi.save();
      req.flash("alertMessage", "Berhasil Ubah Absensi");
      req.flash("alertStatus", "success");
      res.redirect("/absensi");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/absensi");
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const absensi = await Absensi.findOneAndDelete({ _id: id });
      req.flash("alertMessage", "Berhasil Hapus Absensi");
      req.flash("alertStatus", "success");
      res.redirect("/absensi");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/absensi");
    }
  },
};
