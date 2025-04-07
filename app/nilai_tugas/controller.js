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
          category: "Kognitif",
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
  viewCreate: async (req, res) => {
    try {
      const materi = await Materi.find();
      const category = await Category.find();
      const peserta = await Peserta.find();

      res.render("admin/nilai_tugas/create", {
        materi,
        category,
        peserta,
        name: req.session.user.name,
        title: "Halaman Tambah Nilai Penugasan Peserta",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nilai_tugas");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const {
        pesertaId,
        materiId,
        nilaiPengetahuan,
        nilaiPemahaman,
        nilaiAnalisis,
      } = req.body;
      if ((!pesertaId || !materiId)) {
        req.flash("alertMessage", "Peserta harus dipilih.");
        req.flash("alertStatus", "danger");
        return res.redirect("/nilai_tugas");
      }

      const existingNilai = await NilaiKognitif.findOne({
        namePeserta: pesertaId,
        name_materi: materiId,
      });

      if (existingNilai) {
        req.flash(
          "alertMessage",
          "Nilai untuk peserta dan materi ini sudah ada."
        );
        req.flash("alertStatus", "danger");
        return res.redirect("/nilai_tugas");
      }
      const newNilaiTUgas = await NilaiKognitif({
        namePeserta: pesertaId,
        nilaiCategory: "Kognitif",
        name_materi: materiId,
        nilaiPengetahuan: nilaiPengetahuan || 0,
        nilaiPemahaman: nilaiPemahaman || 0,
        nilaiAnalisis: nilaiAnalisis || 0,
        namePemandu: req.session.user.name,
      });
      await newNilaiTUgas.save();
      req.flash("alertMessage", "Nilai Tugas berhasil ditambahkan.");
      req.flash("alertStatus", "success");
      res.redirect("/nilai_tugas");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nilai_tugas");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const nilai = await NilaiKognitif.findById(id)
        .populate("namePeserta")
        .populate("name_materi");
      const peserta = await Peserta.find();
      const materi = await Materi.find();
      const category = await Category.find();
  
      res.render("admin/nilai_tugas/edit", {
        nilai,
        peserta,
        materi,
        category,
        name: req.session.user.name,
        title: "Halaman Edit Nilai Penugasan Peserta",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nilai_tugas");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        pesertaId,
        materiId,
        nilaiPengetahuan,
        nilaiPemahaman,
        nilaiAnalisis,
      } = req.body;
  
      await NilaiKognitif.findOneAndUpdate(
        { _id: id },
        {
          namePeserta: pesertaId,
          name_materi: materiId,
          nilaiPengetahuan: nilaiPengetahuan || 0,
          nilaiPemahaman: nilaiPemahaman || 0,
          nilaiAnalisis: nilaiAnalisis || 0,
        }
      );
  
      req.flash("alertMessage", "Berhasil mengubah nilai tugas.");
      req.flash("alertStatus", "success");
      res.redirect("/nilai_tugas");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nilai_tugas");
    }
  },
    
};
