const Peserta = require("../peserta/model");
const Category = require("../category/model");
const NilaiMakalah = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };

      const peserta = await Peserta.find();
      const nilai = await NilaiMakalah.find();
      const category = await Category.find();

      // Proses pengolahan data peserta dan nilai
      const MakalahPeserta = peserta.map((peserta) => {
        const nilaiPeserta = nilai.find(
          (item) => item.namePeserta.toString() === peserta._id.toString()
        );

        const nilaiPenulisan = nilaiPeserta?.nilaiPenulisan || 0;
        const nilaiPenyampaian = nilaiPeserta?.nilaiPenyampaian || 0;
        const nilaiRespon = nilaiPeserta?.nilaiRespon || 0;

        const totalNilai = nilaiPenulisan + nilaiPenyampaian + nilaiRespon || 0;
        const rataRata = totalNilai / 3;

        return {
          _id: nilaiPeserta ? nilaiPeserta._id : null,
          user: req.session.user.name,
          pesertaName: peserta.name,
          asalCabang: peserta.asal_cabang,
          category: "Kognitif",
          nilaiPenulisan,
          nilaiPenyampaian,
          nilaiRespon,
          rataRata: Math.round(rataRata),
        };
      });

      res.render("admin/makalah_peserta/view_makalah_peserta", {
        category: "Kognitif",
        peserta,
        alert,
        MakalahPeserta,
        name: req.session.user.name,
        title: "Halaman Nilai Makalah",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nilai-makalah");
    }
  },

  viewCreate: async (req, res) => {
    try {
      const peserta = await Peserta.find();
      const nilaiCategory = await Category.find();

      res.render("admin/makalah_peserta/create", {
        nilaiCategory,
        peserta,
        name: req.session.user.name,
        title: "Halaman Tambah Nilai Makalah",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nilai-makalah");
    }
  },

  actionCreate: async (req, res) => {
    try {
      const {
        pesertaId,
        nilaiPenulisan,
        nilaiPenyampaian,
        nilaiRespon,
        nilaiCategory,
      } = req.body;

      if (!pesertaId || !nilaiCategory) {
        req.flash("alertMessage", "Kategori nilai dan peserta harus dipilih.");
        req.flash("alertStatus", "danger");
        return res.redirect("/nilai-makalah");
      }

      const existingNilai = await NilaiMakalah.findOne({
        namePeserta: pesertaId,
        nilaiCategory: nilaiCategory,
      });

      if (existingNilai) {
        req.flash("alertMessage", "Nilai untuk peserta ini sudah ada.");
        req.flash("alertStatus", "danger");
        return res.redirect("/nilai-makalah");
      }

      const newNilaiMakalah = new NilaiMakalah({
        namePeserta: pesertaId,
        nilaiPenulisan: nilaiPenulisan || 0,
        nilaiPenyampaian: nilaiPenyampaian || 0,
        nilaiRespon: nilaiRespon || 0,
        nilaiCategory: nilaiCategory,
        user: req.session.user.name,
      });

      await newNilaiMakalah.save();

      req.flash("alertMessage", "Nilai Makalah berhasil ditambahkan.");
      req.flash("alertStatus", "success");
      res.redirect("/nilai-makalah");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nilai-makalah");
    }
  },
  viewEdit: async (req,res) => {
    try {
      const nilaiId = req.params.id;
      const nilai = await NilaiMakalah
      .findById(nilaiId)
      .populate('namePeserta');
      if (!nilai) {
        req.flash("alertMessage", "Data nilai tidak ditemukan.");
        req.flash("alertStatus", "danger");
        return res.redirect("/nilai-makalah");
      }
      res.render("admin/makalah_peserta/edit", {
        nilai: nilai,
        name: req.session.user.name,
        title: "Halaman Ubah Nilai Makalah",
      })
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nilai-makalah");
    }
  },
  actionEdit:async (req, res) => {
    try {
      const { id } = req.params;
      const { nilaiPenulisan, nilaiPenyampaian, nilaiRespon, nilaiCategory } = req.body;

      await NilaiMakalah.findOneAndUpdate(
        { _id: id },
        { $set: { nilaiPenulisan, nilaiPenyampaian, nilaiRespon, nilaiCategory } }
      );  

      req.flash("alertMessage", "Nilai Makalah berhasil diubah.");    
      req.flash("alertStatus", "success");
      res.redirect("/nilai-makalah");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nilai-makalah");
    }
  }
};
