const XLSX = require("xlsx");
const Peserta = require("./model");
const fs = require("fs");
const path = require("path");
const { title } = require("process");
const bcrypt = require ("bcryptjs");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      const peserta = await Peserta.find();
      res.render("admin/peserta/view_peserta", {
        peserta,
        alert,
        name: req.session.user.name,
        title: "Halaman Peserta",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/peserta");
    }
  },
  viewCreate: async (req, res) => {
    try {
      res.render("admin/peserta/create", {
        title: "Halaman Tambah Peserta",
        name: req.session.user.name,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/peserta");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { name, email, no_Hp, asal_komisariat, asal_cabang, password, confrimPassword } = req.body;
      if (password !== confrimPassword) {
        req.flash (
          "alertMessage",
          "Kata Sandi dan konfirmasi Kata Sandi tidak cocok"
        )
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      let peserta = await Peserta({
        name,
        email,
        no_Hp,
        asal_komisariat,
        asal_cabang,
        password : hashedPassword,
      });
      await peserta.save();
      req.flash("alertMessage", "Berhasil Tambah Peserta");
      req.flash("alertStatus", "success");
      res.redirect("/peserta");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/peserta");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;

      const peserta = await Peserta.findOne({ _id: id });
      res.render("admin/peserta/edit", {
        peserta,
        title: "Halaman Ubah Peserta",
        name: req.session.user.name,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/peserta");
    }
  },
  viewUpload: async (req, res) => {
    try {
      res.render("admin/peserta/upload", {
        title: "Halaman Ubah File Excel",
        name: req.session.user.name,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/peserta");
    }
  },
  actionUpload: async (req, res) => {
    try {
      // Periksa apakah file diunggah
      if (!req.file) {
        throw new Error("File Excel tidak ditemukan. Silakan unggah file.");
      }

      // Lokasi sementara file Excel
      const tmpPath = req.file.path;

      // Baca file Excel
      const workbook = XLSX.readFile(tmpPath);
      const sheetName = workbook.SheetNames[0]; // Ambil sheet pertama
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]); // Konversi sheet ke JSON

      // Validasi data dari Excel
      if (!sheetData || sheetData.length === 0) {
        throw new Error("File Excel kosong atau tidak valid.");
      }

      // Proses setiap baris data
      for (let row of sheetData) {
        const { name, email, no_Hp, asal_komisariat, asal_cabang, password } = row;

        if (!name || !email || !no_Hp || !asal_komisariat || !asal_cabang || !password) {
          throw new Error("Data dalam file Excel tidak lengkap.");
        }
        const hashedPassword = await bcrypt.hash(password,10)

        // Simpan data ke database
        const peserta = new Peserta({
          name,
          email,
          no_Hp,
          asal_komisariat,
          asal_cabang,
          password : hashedPassword
        });

        await peserta.save();
      }

      // Hapus file sementara setelah diproses
      fs.unlinkSync(tmpPath);

      // Kirim pesan sukses
      req.flash(
        "alertMessage",
        "Berhasil menambahkan peserta dari file Excel."
      );
      req.flash("alertStatus", "success");
      res.redirect("/peserta");
    } catch (err) {
      // Tangani error
      console.error(err.message);
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/peserta");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, no_Hp, asal_komisariat, asal_cabang } = req.body;

      await Peserta.findOneAndUpdate(
        {
          _id: id,
        },
        { name, email, no_Hp, asal_komisariat, asal_cabang }
      );
      req.flash("alertMessage", "Berhasil Ubah Peserta");
      req.flash("alertStatus", "success");
      res.redirect("/peserta");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/peserta");
    }
  },

  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      await Peserta.findOneAndDelete({ _id: id });
      req.flash("alertMessage", "Berhasil Hapus Peserta");
      req.flash("alertStatus", "success");
      res.redirect("/peserta");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/peserta");
    }
  },
  actionLogout: (req, res) => {
    req.session.destroy();
    res.redirect("/");
  },
};
