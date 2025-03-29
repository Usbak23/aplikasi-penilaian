const Peserta = require("../peserta/model");
const Category = require("../category/model");
const nilaiMidTest = require("./model");

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
      const nilai = await nilaiMidTest.find();

      //
      const MidTest = peserta.map((peserta) => {
        const nilaiTes = nilai.find(
          (nilai) => peserta._id.toString() === nilai.namePeserta.toString()
        );
        return {
          pesertaName: peserta.name,
          pesertaCabang: peserta.asal_cabang,
          nilaiTes: nilaiTes ? nilaiTes.nilai : 0,
        };
      });
      res.render("admin/midTest/view_midTest", {
        name: req.session.user.name,
        category: "Kognitif",
        MidTest,
        peserta,
        alert,
        name: req.session.user.name,
        title: "Halaman Nilai Middle Test",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/mid-test");
    }
  },
  viewCreate: async (req, res) => {
    try {
      const peserta = await Peserta.find();
      const nilaiCategory = await Category.find();

      res.render("admin/midTest/create", {
        name: req.session.user.name,
        category: "Kognitif",
        nilaiCategory,
        peserta,
        title: "Halaman Tambah Nilai Middle Test",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/mid-test");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { pesertaId, nilaiCategory, nilaiMidtest } = req.body;

      if (!pesertaId || !nilaiCategory  === undefined) {
        req.flash(
          "alertMessage",
          "Peserta, kategori nilai harus diisi."
        );
        req.flash("alertStatus", "danger");
        return res.redirect("/mid-test");
      }

      const existingNilai = await nilaiMidTest.findOne({
        namePeserta: pesertaId,
      });

      if (existingNilai) {
        req.flash("alertMessage", "Nilai untuk peserta ini sudah ada.");
        req.flash("alertStatus", "danger");
        return res.redirect("/mid-test");
      }

      const newNilaiMidTest = new nilaiMidTest({
        namePeserta: pesertaId,
        nilaiCategory: nilaiCategory,
        nilaimidTest: nilaiMidtest || 0, // Default ke 0 jika tidak ada nilai mid-test
        user: req.session.user.name, // Ambil user dari session
      });

      await newNilaiMidTest.save();

      req.flash("alertMessage", "Nilai Middle Test berhasil ditambahkan.");
      req.flash("alertStatus", "success");
      res.redirect("/mid-test");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/mid-test");
    }
  },
};
