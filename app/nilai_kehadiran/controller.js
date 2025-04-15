const RecapAbsensi = require('../data_absensi/model');
const NilaiKehadiran = require('./model');
const Materi = require('../materi/model');
const Category = require('../category/model');
const Peserta = require('../peserta/model'); // ← Tambahkan ini kalau belum ada

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

      // Ambil semua nilai kehadiran dan populate data terkait
      const nilaiKehadiranList = await NilaiKehadiran.find()
        .populate("user")
        .populate("namePeserta")
        .populate("nilaiCategory")
        .populate("materi")
        .populate({
          path: "nilaiPresensi",
          populate: {
            path: "status", // jika ada relasi nested di dalamnya
          }
        });

      // Debug: lihat data nilai kehadiran
      console.log("DATA NILAI KEHADIRAN FULL:", JSON.stringify(nilaiKehadiranList, null, 2));

      // Gabungkan data absensi ke dalam nilaiKehadiran
      const nilaiKehadiran = pesertaList.map((peserta) => {
        const absensiData = materiList.map((materi) => {
          // Cari nilai kehadiran untuk peserta dan materi tertentu
          const nilai = nilaiKehadiranList.find(
            (n) =>
              n.namePeserta &&
              n.namePeserta[0]?._id.toString() === peserta._id.toString() &&
              n.materi &&
              n.materi[0]?._id.toString() === materi._id.toString()
          );

          let nilaiAngka = "Belum Divalidasi";
          if (nilai && nilai.nilaiPresensi.length > 0) {
            const nilaiObj = nilai.nilaiPresensi[0];
            if (nilaiObj && typeof nilaiObj.nilaiAbsensi !== 'undefined') {
              nilaiAngka = nilaiObj.nilaiAbsensi;
            }
          }

          return {
            namaMateri: materi.name || materi.materi || "Tidak ada materi",
            bobotNilai: nilaiAngka,
          };
        });

        const totalNilaiKehadiran = absensiData.reduce((total, absensi) => {
          return total + (parseInt(absensi.bobotNilai) || 0);
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
