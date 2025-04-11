const Absensi = require('../absensi/model');
const Peserta = require('../peserta/model');
const RecapAbsensi = require('./model');
const SetNilai = require('../nilai_absensi/model'); // Model status kehadiran (nilaiAbsensi)

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      // Ambil semua peserta
      const pesertaList = await Peserta.find();

      // Ambil semua materi absensi dan populate nama materi
      const materiList = await Absensi.find().populate("name_materi", "materi");

      // Ambil data recap absensi, termasuk status (populate)
      const data_absensi = await RecapAbsensi.find()
        .populate("namePeserta")
        .populate("nameAbsensi")
        .populate("status"); // populasi status dari SetNilai

      // Gabungkan peserta dengan materi dan status
      const pesertaWithAbsensi = pesertaList.map((peserta) => {
        const materiStatus = materiList.map((materi) => {
          // Cari recap untuk peserta dan materi tertentu
          const absensi = data_absensi.find(
            (recap) =>
              recap.namePeserta &&
              recap.namePeserta._id.toString() === peserta._id.toString() &&
              recap.nameAbsensi &&
              recap.nameAbsensi._id.toString() === materi._id.toString()
          );

          let statusLabel = "Belum Presensi"; // default
          if (absensi && absensi.status && absensi.status.length > 0) {
            // Ambil status pertama (karena array)
            statusLabel = absensi.status[0].status;
          }

          return {
            materiName: materi.name_materi[0]?.materi || "Tidak ada materi",
            status: statusLabel,
          };
        });

        return {
          name: peserta.name,
          asal_cabang: peserta.asal_cabang,
          materiStatus,
        };
      });

      // Render view
      res.render("admin/data_absensi/view_data_absensi", {
        pesertaWithAbsensi,
        alert,
        name: req.session.user.name,
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
  },
    scan: async (req, res) => {
    },
};
