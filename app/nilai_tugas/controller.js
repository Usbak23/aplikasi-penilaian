const Materi = require("../materi/model");
const Peserta = require("../peserta/model");
const Category = require("../category/model");
const NilaiKognitif = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };

      const materi = await Materi.find();
      const peserta = await Peserta.find();
      const nilai = await NilaiKognitif.find();
      const category = await Category.find();

      // Proses pengolahan data peserta dan nilai
      const KognitifPeserta = peserta.map((peserta) => {
        const nilaiMateri = materi.map((materi) => {
          const NilaiKognitif = nilai.find(
            (nilai) =>
              peserta._id.toString() === nilai.namePeserta.toString() &&
              materi._id.toString() === nilai.name_materi.toString()
          );

          return {
            materiName: materi.name,
            Pengetahuan: NilaiKognitif ? NilaiKognitif.nilaiPengetahuan : 0,
            Pemahaman: NilaiKognitif ? NilaiKognitif.nilaiPemahaman : 0,
            Analisis: NilaiKognitif ? NilaiKognitif.nilaiAnalisis : 0,
          };
        });

        // Hitung jumlah dan rata-rata untuk setiap peserta
        const totalNilai = nilaiMateri.reduce(
          (total, materi) =>
            total + materi.Pengetahuan + materi.Analisis + materi.Pemahaman,
          0
        );
        const jumlahMateri = nilaiMateri.length * 3; // Reaksi, Adaptasi, Persepsi per materi
        const rataRata = jumlahMateri > 0 ? totalNilai / jumlahMateri : 0;

        return {
          user: req.session.user.name, // Admin user
          pesertaName: peserta.name,
          asalCabang: peserta.asal_cabang,
          category: "kognitif",
          nilaiMateri,
          Jumlah: Math.round(rataRata), // Rata-rata dibulatkan
        };
      });




      // Render ke view
      res.render("admin/nilai_tugas/view_nilai", {
        category,
        alert,
        materi,
        KognitifPeserta,
        name: req.session.user.name,
        title: "Halaman Nilai Kognitif",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nilai_tugas");
    }
  },
};
