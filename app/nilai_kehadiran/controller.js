const RecapAbsensi = require('../data_absensi/model');
const NilaiKehadiran = require('./model');
const Materi = require('../materi/model');
const Category = require('../category/model');
const Peserta = require('../peserta/model');

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      // Ambil semua peserta
      const pesertaList = await Peserta.find();

      // Ambil semua materi
      const materiList = await Materi.find();

      // Ambil semua kategori
      const categoryList = await Category.find();

      // Ambil semua recap absensi dan populate data terkait
      const recapList = await RecapAbsensi.find()
        .populate("namePeserta") // Populasi peserta
        .populate({
          path: "nameAbsensi",
          populate: {
            path: "name_materi", // Populasi materi
            model: "Materi"
          }
        })
        .populate({
          path: "status", // Populasi status dari model SetNilai
          select: "bobotNilai" // Ambil hanya field bobotNilai
        });

      // Debug: lihat data recap
      console.log("Recap Absensi:", recapList);

      // Gabungkan data absensi ke dalam nilaiKehadiran
      const nilaiKehadiran = pesertaList.map((peserta) => {
        const absensiData = materiList.map((materi) => {
          // Cari recap absensi untuk peserta dan materi tertentu
          const recap = recapList.find(
            (item) =>
              item.namePeserta[0]?._id.toString() === peserta._id.toString() &&
              item.nameAbsensi[0]?.name_materi[0]?._id.toString() === materi._id.toString()
          );

          let nilaiAngka = 0;
          if (recap && recap.status && recap.status.length > 0) {
            const statusObj = recap.status[0]; // Ambil status pertama
            nilaiAngka = statusObj.bobotNilai || 0;
          }

          return {
            namaMateri: materi.materi || "Tidak ada materi",
            bobotNilai: nilaiAngka,
          };
        });

        const totalNilaiKehadiran = absensiData.reduce((total, absensi) => {
          return total + (parseFloat(absensi.bobotNilai) || 0);
        }, 0);

        return {
          peserta,
          perAbsensi: absensiData,
          totalNilaiKehadiran,
        };
      });

      res.render("admin/nilai_kehadiran/view_nilai", {
        nilaiKehadiran,
        alert,
        name: req.session.user.name,
        title: "Rekap Nilai Kehadiran",
      });
    } catch (err) {
      console.log("Error message:", err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nilai-kehadiran");
    }
  },
};
