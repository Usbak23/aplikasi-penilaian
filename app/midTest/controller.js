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
          nilaiTes: nilaiTes ? nilaiTes.nilaiMidtest : 0,
        };
      });
      res.render("admin/midTest/view_midTest", {
        name: req.session.user.name,
        category: "Kognitif",
        MidTest,
        peserta,
        alert,
        title: "Halaman Nilai Middle Test",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/mid-test");
    }
  },
  // viewCreate: async (req, res) => {
  //   try {
  //     const peserta = await Peserta.find();
  //     res.render("admin/midTest/create", {
  //       name: req.session.user.name,
  //       category: "Kognitif",
  //       peserta,
  //       title: "Halaman Tambah Nilai Middle Test",
  //     });
  //   } catch (err) {
  //     req.flash("alertMessage", `${err.message}`);
  //     req.flash("alertStatus", "danger");
  //     res.redirect("/mid-test");
  //   }
  // },
  // actionCreate: async (req, res) => {
  //   try {
  //     const { pesertaId, nilaiMidtest } = req.body;

  //     if (!pesertaId || nilaiMidtest === undefined) {
  //       req.flash("alertMessage", "Peserta dan nilai middle test harus diisi.");
  //       req.flash("alertStatus", "danger");
  //       return res.redirect("/mid-test/create");
  //     }

  //     const existingNilai = await nilaiMidTest.findOne({
  //       namePeserta: pesertaId,
  //     });

  //     if (existingNilai) {
  //       req.flash("alertMessage", "Nilai untuk peserta ini sudah ada.");
  //       req.flash("alertStatus", "danger");
  //       return res.redirect("/mid-test/create");
  //     }

  //     const newNilaiMidTest = new nilaiMidTest({
  //       namePeserta: pesertaId,
  //       nilaiCategory: "Kognitif",
  //       nilaiMidtest: nilaiMidtest || 0, // Default ke 0 jika tidak ada nilai mid-test
  //       namePemandu: req.session.user.name, // Ambil user dari session
  //     });

  //     await newNilaiMidTest.save();

  //     req.flash("alertMessage", "Nilai Middle Test berhasil ditambahkan.");
  //     req.flash("alertStatus", "success");
  //     res.redirect("/mid-test");
  //   } catch (err) {
  //     req.flash("alertMessage", `${err.message}`);
  //     req.flash("alertStatus", "danger");
  //     res.redirect("/mid-test/create");
  //   }
  // },

  viewCreate: async (req, res) => {
    try {
      const peserta = await Peserta.find();

      res.render("admin/midTest/create", {
        name: req.session.user.name,
        category: "Kognitif",
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
      console.log(req.body);
      
      const { pesertaId, nilaiMidtest } = req.body;

      if (!pesertaId) {
        req.flash("alertMessage", "Peserta harus dipilih.");
        req.flash("alertStatus", "danger");
        return res.redirect("/mid-test/create");
      }

      // Pastikan nilaiMidtest berada dalam batas yang diperbolehkan
      const nilaiMidtestValid = Math.max(50, Math.min(parseInt(nilaiMidtest, 10), 80));

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
        nilaiCategory: "Kognitif", // Default kategori "Kognitif"
        nilaiMidtest: nilaiMidtestValid,
        namePemandu: req.session.user.name, // Menggunakan session user sebagai pemandu
      });

      await newNilaiMidTest.save();

      req.flash("alertMessage", "Nilai Middle Test berhasil ditambahkan.");
      req.flash("alertStatus", "success");
      res.redirect("/mid-test");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/mid-test/create");
    }
  },
};
