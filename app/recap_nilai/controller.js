const RecapitulasiNilai = require("./model");
const Peserta = require("../peserta/model");
const Category = require("../category/model");

// Import semua model nilai yang dibutuhkan
const NilaiTugas = require("../nilai_tugas/model");
const NilaiMakalah = require("../makalah_peserta/model");
const MidTest = require("../midTest/model");
const PostTest = require("../posTest/model");
const FGD = require("../fg_discuss/model");
const NilaiPsikomotorik = require("../nilai_psikomotorik/model");
const Absensi = require("../absensi/model");
const NilaiAfektif = require("../nilai_afektif/model");

module.exports = {
  index: async (req, res) => {
    try {
      const peserta = await Peserta.find();
      const categoryList = await Category.find();

      const recapData = [];

      for (const p of peserta) {
        // KOGNITIF
        const nilaiTugas = await NilaiTugas.find({ namePeserta: p._id });
        const nilaiMakalah = await NilaiMakalah.findOne({ namePeserta: p._id });
        const midTest = await MidTest.findOne({ namePeserta: p._id });
        const postTest = await PostTest.findOne({ namePeserta: p._id });
        const fgd = await FGD.findOne({ namePeserta: p._id });

        const kognitifScore = (
          (nilaiTugas.reduce((sum, n) => sum + n.nilaiPengetahuan + n.nilaiPemahaman + n.nilaiAnalisis, 0) /
            (nilaiTugas.length * 3 || 1)) +
          (nilaiMakalah?.rataRata || 0) +
          (midTest?.rataRata || 0) +
          (postTest?.rataRata || 0) +
          (fgd?.nilaiFgd || 0)
        ) / 5;

        // PSIKOMOTORIK
        const nilaiPsiko = await NilaiPsikomotorik.findOne({ namePeserta: p._id });
        const psikomotorikScore = nilaiPsiko?.rataRata || 0;

        // AFEKTIF
        const absensi = await Absensi.find({ namePeserta: p._id });
        let afektifScore = 0;
        if (absensi.length > 0) {
          const total = absensi.reduce((sum, a) => {
            switch (a.status) {
              case "Hadir":
                return sum + 80;
              case "Sakit":
                return sum + 60;
              case "Izin":
                return sum + 60;
              case "Alpha":
                return sum + 40;
              case "Terlambat":
                return sum + 60;
              default:
                return sum;
            }
          }, 0);
          afektifScore = total / absensi.length;
        }

        // Persentase
        const bobotKognitif = categoryList.find(c => c.name === "Kognitif")?.bobotNilai || 0;
        const bobotPsikomotorik = categoryList.find(c => c.name === "Psikomotorik")?.bobotNilai || 0;
        const bobotAfektif = categoryList.find(c => c.name === "Afektif")?.bobotNilai || 0;

        const totalScore =
          (kognitifScore * bobotKognitif / 100) +
          (psikomotorikScore * bobotPsikomotorik / 100) +
          (afektifScore * bobotAfektif / 100);

        // Predikat dan Keterangan
        let predikat = "Kurang";
        if (totalScore >= 85) predikat = "Sangat Baik";
        else if (totalScore >= 75) predikat = "Baik";
        else if (totalScore >= 65) predikat = "Cukup";

        // Simpan ke dalam array (atau bisa juga langsung ke database)
        recapData.push({
          peserta: p.name,
          nilaiCategory: {
            Kognitif: Math.round(kognitifScore),
            Psikomotorik: Math.round(psikomotorikScore),
            Afektif: Math.round(afektifScore),
          },
          TotalNilai: Math.round(totalScore),
          predikat,
          keterangan: totalScore >= 65 ? "Lulus" : "Tidak Lulus",
        });
      }

      res.render("admin/rekapitulasi_nilai/view", {
        recapData,
        title: "Rekapitulasi Nilai Peserta",
        name: req.session.user.name
      });
    } catch (error) {
      console.error(error);
      req.flash("alertMessage", error.message);
      req.flash("alertStatus", "danger");
      res.redirect("/dashboard");
    }
  }
};
