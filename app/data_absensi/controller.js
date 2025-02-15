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

  viewScan :async (req, res) => {
    try {
        const alertMessage = req.flash("alertMessage");
        const alertStatus = req.flash("alertStatus");
        const alert = { message: alertMessage, status: alertStatus };
        const pesertaName = req.session.user.name;
        res.render("peserta/scan_barcode/scan", {
            title: "Halaman Scan Absensi Peserta Training",
            name: req.session.user.name,
            alert,
            pesertaId: req.session.user._id, // Mengambil ID peserta dari session
            pesertaName
        });
    } catch (err) {
        req.flash("alertMessage", `${err.message}`);
        req.flash("alertStatus", "danger");
        res.redirect("/");
    }
},
  scan: async (req, res) => {
    try {
      const { qrData, pesertaId } = req.body;

      if (!qrData || !pesertaId) {
        throw new Error("Data QR Code atau ID Peserta tidak ditemukan!");
      }

      // Parse QR data
      const { name_materi, startTime, endTime } = JSON.parse(qrData);

      // Cari absensi berdasarkan data QR Code
      const absensi = await Absensi.findOne({
        "name_materi": name_materi,
        "startTime": startTime,
        "endTime": endTime,
      });

      if (!absensi) {
        throw new Error("Absensi tidak ditemukan atau QR Code tidak valid!");
      }

      // Cek apakah peserta sudah tercatat di recap
      const isAlreadyPresent = await RecapAbsensi.findOne({
        namePeserta: pesertaId,
        nameAbsensi: absensi._id,
      });

      if (isAlreadyPresent) {
        req.flash("alertMessage", "Anda sudah tercatat hadir sebelumnya!");
        req.flash("alertStatus", "info");
        return res.redirect("/peserta/scan-barcode");
      }

      // Simpan ke recap absensi
      const recapAbsensi = new RecapAbsensi({
        namePeserta: pesertaId,
        nameAbsensi: absensi._id,
      });

      await recapAbsensi.save();

      req.flash("alertMessage", "Berhasil mencatat kehadiran!");
      req.flash("alertStatus", "success");
      res.redirect("/peserta/scan-barcode");
    } catch (err) {
      console.error(err.message);
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/peserta/scan-barcode");
    }
  },
};
