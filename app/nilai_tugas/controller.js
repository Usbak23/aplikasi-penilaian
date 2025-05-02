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
  
      const KognitifPeserta = peserta.map((peserta) => {
        const nilaiMateri = materi.map((materi) => {
          const nilaiKognitif = nilai.find(
            (n) =>
              peserta._id.toString() === n.namePeserta.toString() &&
              materi._id.toString() === n.name_materi.toString()
          );
  
          return {
            idNilai: nilaiKognitif ? nilaiKognitif._id : null,
            materiName: materi.name,
            Pengetahuan: nilaiKognitif ? nilaiKognitif.nilaiPengetahuan : 0,
            Pemahaman: nilaiKognitif ? nilaiKognitif.nilaiPemahaman : 0,
            Analisis: nilaiKognitif ? nilaiKognitif.nilaiAnalisis : 0,
          };
        });
  
        const totalNilai = nilaiMateri.reduce(
          (total, materi) => total + materi.Pengetahuan + materi.Pemahaman + materi.Analisis,
          0
        );
  
        const jumlahMateri = nilaiMateri.length * 3;
        const rataRata = jumlahMateri > 0 ? totalNilai / jumlahMateri : 0;
  
        return {
          pesertaId: peserta._id,
          pesertaName: peserta.name,
          asalCabang: peserta.asal_cabang,
          nilaiMateri,
          Jumlah: Math.round(rataRata),
        };
      });
  
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
      const nilaiId = req.params.id;

      // Cari nilai berdasarkan ID dan populate untuk mendapatkan nama peserta dan materi
      const nilai = await NilaiKognitif.findById(nilaiId)
        .populate('namePeserta') // Populate untuk nama peserta
        .populate('name_materi');  // Populate untuk materi

      if (!nilai) {
        req.flash("alertMessage", "Data nilai tidak ditemukan.");
        req.flash("alertStatus", "danger");
        return res.redirect("/nilai_tugas");
      }
      
      // Kirim data nilai dan materi untuk rendering
      res.render('admin/nilai_tugas/edit', {
        nilai: nilai,  // berisi data nilai dan peserta
        materi: nilai.materi,  // berisi data materi
        name: req.session.user.name,
        title: "Halaman Edit Nilai Kognitif",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nilai_tugas");
    }
  },

  // Aksi edit
  actionEdit: async (req, res) => {
    try {
      const { nilaiPengetahuan, nilaiPemahaman, nilaiAnalisis } = req.body;

      const nilai = await NilaiKognitif.findById(req.params.id);

      if (!nilai) {
        req.flash("alertMessage", "Data nilai tidak ditemukan.");
        req.flash("alertStatus", "danger");
        return res.redirect("/nilai_tugas");
      }

      // Update nilai
      nilai.nilaiPengetahuan = nilaiPengetahuan || nilai.nilaiPengetahuan;
      nilai.nilaiPemahaman = nilaiPemahaman || nilai.nilaiPemahaman;
      nilai.nilaiAnalisis = nilaiAnalisis || nilai.nilaiAnalisis;

      await nilai.save();
      req.flash("alertMessage", "Nilai berhasil diperbarui.");
      req.flash("alertStatus", "success");
      res.redirect("/nilai_tugas");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nilai_tugas");
    }
  },
};