const Absensi = require('../absensi/model');
const Peserta = require('../peserta/model');
const RecapAbsensi = require('./model');
const Materi = require('../materi/model');

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      // Ambil semua peserta
      const pesertaList = await Peserta.find();

      // Ambil semua materi absensi
      const materiList = await Absensi.find().populate("name_materi", "materi");


      // Ambil data absensi recap
      const data_absensi = await RecapAbsensi.find()
        .populate("namePeserta")
        .populate("nameAbsensi");

      // Gabungkan peserta dengan materi dan status hadir
      const pesertaWithAbsensi = pesertaList.map((peserta) => {
        const materiStatus = materiList.map((materi) => {
          // Cari apakah peserta hadir di materi ini
          const absensi = data_absensi.find(
            (recap) =>
              recap.namePeserta &&
              recap.namePeserta._id.toString() === peserta._id.toString() &&
              recap.nameAbsensi &&
              recap.nameAbsensi._id.toString() === materi._id.toString()
          );

          return {
            materiName: materi.name_materi[0].materi,
            status: absensi ? "Hadir" : "Tidak Hadir",
          };
        });

        return {
          // materi: materiName,
          name: peserta.name,
          asal_cabang: peserta.asal_cabang,
          materiStatus,
        };
      });

      // Render ke view
      res.render("admin/data_absensi/view_data_absensi", {
        pesertaWithAbsensi, // Data peserta dengan materi dan status hadir
        alert,
        name : req.session.user.name,
        title: "Halaman Data Absensi Peserta Training",
      });
    } catch (err) {
      console.log("Error message:", err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/recap_absensi");
    }
  },

  scan: async (req, res) => {
    try {
      const { barcodePath, pesertaId } = req.body;

      // Cari materi berdasarkan barcodePath
      const absensi = await Absensi.findOne({ barcodePath });
      if (!absensi) {
        req.flash("alertMessage", "barcode tidak valid!");
        req.flash("alertStatus", "danger");
        return res.redirect("/recap_absensi");
      }

      // Pastikan peserta valid
      const peserta = await Peserta.findById(pesertaId);
      if (!peserta) {
        req.flash("alertMessage", "Peserta tidak ditemukan!");
        req.flash("alertStatus", "danger");
        return res.redirect("/recap_absensi");
      }

      // Cek apakah peserta sudah hadir
      const existingRecap = await RecapAbsensi.findOne({
        namePeserta: peserta._id,
        nameAbsensi: absensi._id,
      });

      if (existingRecap) {
        req.flash("alertMessage", "Peserta sudah absen!");
        req.flash("alertStatus", "info");
        return res.redirect("/recap_absensi");
      }

      // Simpan kehadiran
      const newRecap = new RecapAbsensi({
        namePeserta: peserta._id,
        nameAbsensi: absensi._id,
      });
      await newRecap.save();

      req.flash("alertMessage", "Absensi berhasil dilakukan!");
      req.flash("alertStatus", "success");
      res.redirect("/recap_absensi");
    } catch (err) {
      console.log("Error message:", err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/recap_absensi");
    }
  },
};
