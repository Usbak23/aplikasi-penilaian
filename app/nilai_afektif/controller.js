const Materi = require("../materi/model");
const Peserta = require("../peserta/model");
const Category = require("../category/model");
const NilaiAfektif = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };

      const materi = await Materi.find();
      const peserta = await Peserta.find();
      const nilai = await NilaiAfektif.find();
      const category = await Category.find();

      // Proses pengolahan data peserta dan nilai
      const AfektifPeserta = peserta.map((peserta) => {
        const nilaiMateri = materi.map((materi) => {
          const NilaiAfektif = nilai.find(
            (nilai) =>
              peserta._id.toString() === nilai.namePeserta.toString() &&
              materi._id.toString() === nilai.name_materi.toString()
          );

          return {
            materiName: materi.name,
            Penerimaan: NilaiAfektif ? NilaiAfektif.nilaiPenerimaan : 0,
            Responsif: NilaiAfektif ? NilaiAfektif.nilaiResponsif : 0,
            Karakterisasi: NilaiAfektif ? NilaiAfektif.nilaiKarakterisasi : 0,
          };
        });

        // Hitung jumlah dan rata-rata untuk setiap peserta
        const totalNilai = nilaiMateri.reduce(
          (total, materi) =>
            total + materi.Penerimaan + materi.Responsif + materi.Karakterisasi,
          0
        );
        const jumlahMateri = nilaiMateri.length * 3; // Penerimaan, Responsif, Karakterisasi per materi
        const rataRata = jumlahMateri > 0 ? totalNilai / jumlahMateri : 0;

        return {
          user: req.session.user.name, // Admin user
          pesertaName: peserta.name,
          asalCabang: peserta.asal_cabang,
          category: "Afektif",
          nilaiMateri,
          Jumlah: Math.round(rataRata), // Rata-rata dibulatkan
        };
      });

      // Debug data
      console.log("AfektifPeserta >>>>", AfektifPeserta);

      // Render ke view
      res.render("admin/nilai_afektif/view_nilai", {
        category,
        alert,
        materi,
        AfektifPeserta,
        name: req.session.user.name,
        title: "Halaman Nilai Afektif",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nilai-afektif");
    }
  },
  viewCreate: async (req, res) => {
    try {
      const materi = await Materi.find();
      const peserta = await Peserta.find();
      const nilaiCategory = await Category.find();

      // Render ke view

      res.render("admin/nilai_afektif/create", {
        nilaiCategory,
        materi,
        peserta,
        name: req.session.user.name,
        title: "Halaman Tambah Nilai Psikomotorik",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nilai-afektif");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const {
        pesertaId,
        materiId,
        nilaiPenerimaan,
        nilaiResponsif,
        nilaiKarakterisasi,
        nilaiCategory,
      } = req.body;

      if (!pesertaId || !materiId || !nilaiCategory) {
        req.flash(
          "alertMessage",
          "Kategori nilai dan peserta/materi harus dipilih."
        );
        req.flash("alertStatus", "danger");
        return res.redirect("/nilai-afektif");
      }

      // Cek apakah nilai psikomotorik sudah ada untuk peserta dan materi yang dipilih
      const existingNilai = await NilaiAfektif.findOne({
        namePeserta: pesertaId,
        name_materi: materiId,
      });

      if (existingNilai) {
        req.flash("alertMessage", "Nilai untuk peserta ini sudah ada.");
        req.flash("alertStatus", "danger");
        return res.redirect("/nilai-afektif");
      }

      // Membuat nilai psikomotorik baru
      const newNilaiAfektif = new NilaiAfektif({
        namePeserta: pesertaId,
        name_materi: materiId,
        nilaiPenerimaan: nilaiPenerimaan || 0,
        nilaiResponsif: nilaiResponsif || 0,
        nilaiKarakterisasi: nilaiKarakterisasi || 0,
        nilaiCategory: nilaiCategory, // Pastikan nilaiCategory diterima
        user: req.session.user.name, // Pastikan user diambil dari session
      });

      await newNilaiAfektif.save();

      req.flash("alertMessage", "Nilai Psikomotorik berhasil ditambahkan.");
      req.flash("alertStatus", "success");
      res.redirect("/nilai-afektif");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nilai-afektif");
    }
  },
};