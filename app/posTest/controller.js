const Peserta = require("../peserta/model");
const Category = require("../category/model");
const nilaiPosTest = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      const peserta = await Peserta.find();
      const category = await Category.find();
      const nilai = await nilaiPosTest.find();

      //
      const PosTest = peserta.map((peserta) => {
        const nilaiTes = nilai.find(
          (nilai) => peserta._id.toString() === nilai.namePeserta.toString()
        );
        return {
          _id: nilaiTes ? nilaiTes._id : null, 
          pesertaName: peserta.name,
          pesertaCabang: peserta.asal_cabang,
          nilaiTes: nilaiTes ? nilaiTes.nilaiPostest : 0,
        };
      });
      res.render("admin/posTest/view_posTest", {
        name: req.session.user.name,
        category: "Kognitif",
        PosTest,
        peserta,
        alert,
        title: "Halaman Nilai Post Test",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/post-test");
    }
  },

  viewCreate: async (req, res) => {
    try {
      const peserta = await Peserta.find();

      res.render("admin/posTest/create", {
        name: req.session.user.name,
        category: "Kognitif",
        peserta,
        title: "Halaman Tambah Nilai Post Test",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/post-test");
    }
  },

  actionCreate: async (req, res) => {
    try {
      console.log(req.body);

      const { pesertaId, nilaiPostest } = req.body;

      if (!pesertaId) {
        req.flash("alertMessage", "Peserta harus dipilih.");
        req.flash("alertStatus", "danger");
        return res.redirect("/post-test/create");
      }

      // Pastikan nilaiMidtest berada dalam batas yang diperbolehkan
      const nilaiPostestValid = Math.max(
        50,
        Math.min(parseInt(nilaiPostest, 10), 80)
      );

      const existingNilai = await nilaiPosTest.findOne({
        namePeserta: pesertaId,
      });

      if (existingNilai) {
        req.flash("alertMessage", "Nilai untuk peserta ini sudah ada.");
        req.flash("alertStatus", "danger");
        return res.redirect("/post-test");
      }

      const newNilaiPosTest = new nilaiPosTest({
        namePeserta: pesertaId,
        nilaiCategory: "Kognitif", // Default kategori "Kognitif"
        nilaiPostest: nilaiPostestValid,
        namePemandu: req.session.user.name, // Menggunakan session user sebagai pemandu
      });

      await newNilaiPosTest.save();

      req.flash("alertMessage", "Nilai Middle Test berhasil ditambahkan.");
      req.flash("alertStatus", "success");
      res.redirect("/post-test");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/post-test/create");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const nilaiId = req.params.id;
      const PosTest = await nilaiPosTest
        .findById(nilaiId)
        .populate("namePeserta");
      if (!PosTest) {
        req.flash("alertMessage", "Data nilai tidak ditemukan.");
        req.flash("alertStatus", "danger");
        return res.redirect("/post-test");
      }
      res.render("admin/posTest/edit", {
        nilai: PosTest,
        name: req.session.user.name,
        title: "Halaman Ubah Nilai Post Test",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/post-test");
    }
  },

  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { nilaiPostest } = req.body;

      await nilaiPosTest.findOneAndUpdate(
        { _id: id },
        { $set: { nilaiPostest } }
      );

      req.flash("alertMessage", "Nilai Post Test berhasil diubah.");
      req.flash("alertStatus", "success");
      res.redirect("/post-test");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/post-test");
    }
  },
};
