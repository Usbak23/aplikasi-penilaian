const Materi = require("../materi/model");
const Peserta = require("../peserta/model");
const Category = require("../category/model");
const NilaiPsikomotorik = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };

      const materi = await Materi.find();
      const peserta = await Peserta.find();
      const nilai = await NilaiPsikomotorik.find();
      const category = await Category.find();

      // Proses pengolahan data peserta dan nilai
      const PsikomotorikPeserta = peserta.map((peserta) => {
        const nilaiMateri = materi.map((materi) => {
          const nilaiPsikomotorik = nilai.find(
            (nilai) =>
              peserta._id.toString() === nilai.namePeserta.toString() &&
              materi._id.toString() === nilai.name_materi.toString()
          );

          return {
            materiName: materi.name,
            Reaksi: nilaiPsikomotorik ? nilaiPsikomotorik.nilaiReaksi : 0,
            Adaptasi: nilaiPsikomotorik ? nilaiPsikomotorik.nilaiAdaptasi : 0,
            Persepsi: nilaiPsikomotorik ? nilaiPsikomotorik.nilaiPersepsi : 0,
          };
        });

        // Hitung jumlah dan rata-rata untuk setiap peserta
        const totalNilai = nilaiMateri.reduce(
          (total, materi) =>
            total + materi.Reaksi + materi.Adaptasi + materi.Persepsi,
          0
        );
        const jumlahMateri = nilaiMateri.length * 3; // Reaksi, Adaptasi, Persepsi per materi
        const rataRata = jumlahMateri > 0 ? totalNilai / jumlahMateri : 0;

        return {
          user: req.session.user.name, // Admin user
          pesertaName: peserta.name,
          asalCabang: peserta.asal_cabang,
          category: "Psikomotorik",
          nilaiMateri,
          Jumlah: Math.round(rataRata), // Rata-rata dibulatkan
        };
      });

      // Debug data
      console.log("PsikomotorikPeserta >>>>", PsikomotorikPeserta);

      // Render ke view
      res.render("admin/nilai_psikomotorik/view_nilai", {
        category,
        alert,
        materi,
        PsikomotorikPeserta,
        name: req.session.user.name,
        title: "Halaman Nilai Psikomotorik",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nilai_psikomotorik");
    }
  },
  viewCreate: async (req, res) => {
    try {
      const materi = await Materi.find();
      const peserta = await Peserta.find();
      const nilaiCategory = await Category.find();

      // Render ke view

      res.render("admin/nilai_psikomotorik/create", {
        nilaiCategory,
        materi,
        peserta,
        name: req.session.user.name,
        title: "Halaman Tambah Nilai Psikomotorik",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nilai_psikomotorik");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const {
        pesertaId,
        materiId,
        nilaiReaksi,
        nilaiAdaptasi,
        nilaiPersepsi,
        nilaiCategory,
      } = req.body;

      if (!pesertaId || !materiId || !nilaiCategory) {
        req.flash(
          "alertMessage",
          "Kategori nilai dan peserta/materi harus dipilih."
        );
        req.flash("alertStatus", "danger");
        return res.redirect("/nilai_psikomotorik");
      }

      // Cek apakah nilai psikomotorik sudah ada untuk peserta dan materi yang dipilih
      const existingNilai = await NilaiPsikomotorik.findOne({
        namePeserta: pesertaId,
        name_materi: materiId,
      });

      if (existingNilai) {
        req.flash("alertMessage", "Nilai untuk peserta ini sudah ada.");
        req.flash("alertStatus", "danger");
        return res.redirect("/nilai_psikomotorik");
      }

      // Membuat nilai psikomotorik baru
      const newNilaiPsikomotorik = new NilaiPsikomotorik({
        namePeserta: pesertaId,
        name_materi: materiId,
        nilaiReaksi: nilaiReaksi || 0,
        nilaiAdaptasi: nilaiAdaptasi || 0,
        nilaiPersepsi: nilaiPersepsi || 0,
        nilaiCategory: nilaiCategory, // Pastikan nilaiCategory diterima
        user: req.session.user.name, // Pastikan user diambil dari session
      });

      await newNilaiPsikomotorik.save();

      req.flash("alertMessage", "Nilai Psikomotorik berhasil ditambahkan.");
      req.flash("alertStatus", "success");
      res.redirect("/nilai_psikomotorik");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nilai_psikomotorik");
    }
  },
};
