const RecapitulasiNilai = require("./model");
const Peserta = require("../peserta/model");
const Category = require("../category/model");
const NilaiTugas = require("../nilai_tugas/model");
const NilaiMakalah = require("../nilai_makalah/model");
const MidTes = require("../mid_tes/model");
const PostTes = require("../post_tes/model");
const FGD = require("../fgd/model");
const Psikomotorik = require("../psikomotorik_forum/model");
const AfektifForum = require("../nilai_afektif/model");
const Presensi = require("../presensi/model");

module.exports = {
  rekapNilai: async (req, res) => {
    try {
      const pesertaList = await Peserta.find();
      const categories = await Category.find();

      const recapData = [];

      for (const peserta of pesertaList) {
        // --- KOGNITIF ---
        const tugas = await NilaiTugas.find({ namePeserta: peserta._id });
        const makalah = await NilaiMakalah.find({ namePeserta: peserta._id });
        const midtes = await MidTes.findOne({ namePeserta: peserta._id });
        const posttes = await PostTes.findOne({ namePeserta: peserta._id });
        const fgd = await FGD.findOne({ namePeserta: peserta._id });

        const nilaiTugas = tugas.reduce((sum, item) => sum + item.nilai, 0) / (tugas.length || 1);
        const nilaiMakalah = makalah.reduce((sum, item) => sum + item.nilai, 0) / (makalah.length || 1);

        const kognitif = (nilaiTugas + nilaiMakalah + (midtes?.nilai || 0) + (posttes?.nilai || 0) + (fgd?.nilai || 0)) / 5;

        // --- PSIKOMOTORIK ---
        const psikomotorik = await Psikomotorik.find({ namePeserta: peserta._id });
        const totalP = psikomotorik.reduce((sum, p) => sum + (p.total || 0), 0);
        const rataPsikomotorik = totalP / (psikomotorik.length || 1);

        // --- AFEKTIF ---
        const afektif = await AfektifForum.find({ namePeserta: peserta._id });
        const totalA = afektif.reduce((sum, a) => sum + (a.nilaiPenerimaan + a.nilaiResponsif + a.nilaiKarakterisasi), 0);
        const rataAfektif = totalA / (afektif.length * 3 || 1);

        // --- PRESENSI KEHADIRAN ---
        const presensi = await Presensi.find({ peserta: peserta._id });
        let totalPresensi = 0;
        for (const p of presensi) {
          switch (p.status) {
            case "hadir":
              totalPresensi += 80;
              break;
            case "sakit":
              totalPresensi += 60;
              break;
            case "terlambat":
              totalPresensi += 60;
              break;
            case "alfa":
            default:
              totalPresensi += 40;
          }
        }
        const rataPresensi = totalPresensi / (presensi.length || 1);

        // Cari bobot kategori
        const bobotKognitif = categories.find(c => c.name === "Kognitif")?.bobotNilai || 0;
        const bobotPsikomotorik = categories.find(c => c.name === "Psikomotorik")?.bobotNilai || 0;
        const bobotAfektif = categories.find(c => c.name === "Afektif")?.bobotNilai || 0;

        const nilaiAfektifGabungan = (rataAfektif + rataPresensi) / 2;

        const nilaiPerKategori = [
          { category: categories.find(c => c.name === "Kognitif")._id, nilai: kognitif },
          { category: categories.find(c => c.name === "Psikomotorik")._id, nilai: rataPsikomotorik },
          { category: categories.find(c => c.name === "Afektif")._id, nilai: nilaiAfektifGabungan },
        ];

        const totalNilai = ((kognitif * bobotKognitif) + (rataPsikomotorik * bobotPsikomotorik) + (nilaiAfektifGabungan * bobotAfektif)) / 100;

        let predikat = "Cukup";
        if (totalNilai >= 85) predikat = "Istimewa";
        else if (totalNilai >= 75) predikat = "Baik";
        else if (totalNilai >= 65) predikat = "Cukup";
        else predikat = "Kurang";

        // Simpan ke DB
        await RecapitulasiNilai.findOneAndUpdate(
          { nama: peserta._id },
          {
            nama: peserta._id,
            nilaiKategori: nilaiPerKategori,
            totalNilai,
            predikat,
            keterangan: "--",
          },
          { upsert: true, new: true }
        );

        recapData.push({ peserta: peserta.name, totalNilai, predikat });
      }

      res.render("admin/rekapitulasi_nilai/index", {
        recapData,
        title: "Halaman Rekapitulasi Nilai",
        name: req.session.user.name,
      });
    } catch (error) {
      console.log(error);
      res.redirect("/");
    }
  },
};
