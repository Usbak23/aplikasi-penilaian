const Peserta = require("../peserta/model");
const Category = require("../category/model");
const nilaipostTest = require("./model");

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
      const nilai = await nilaipostTest.find();

      //
      const PosTest = peserta.map((peserta) => {
        const nilaiTes = nilai.find(
          (nilai) => peserta._id.toString() === nilai.namePeserta.toString()
        );
        return {
          pesertaName: peserta.name,
          pesertaCabang: peserta.asal_cabang,
          nilaiTes: nilaiTes ? nilaiTes.nilai : 0,
        };
      });
      res.render("admin/posTest/view_posTest", {
        name: req.session.user.name,
        category: "Kognitif",
        PosTest,
        peserta,
        alert,
        name: req.session.user.name,
        title: "Halaman Nilai Postest",
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
      const nilaiCategory = await Category.find();

      res.render("admin/posTest/create", {
        name: req.session.user.name,
        category: "Kognitif",
        nilaiCategory,
        peserta,
        title: "Halaman Tambah Nilai Postest",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/post-test");
    }
  },
    actionCreate: async (req, res) => {
        try {
            const { pesertaId, nilaiCategory, nilaiPostest } = req.body;
    
            if (!pesertaId || !nilaiCategory || nilaiPostest === undefined) {
                req.flash("alertMessage", "Peserta, kategori nilai, dan nilai post-test harus diisi.");
                req.flash("alertStatus", "danger");
                return res.redirect("/post-test");
            }
    
            // Cek apakah nilai afektif sudah ada untuk peserta ini
            const existingNilai = await nilaipostTest.findOne({ namePeserta: pesertaId });
    
            if (existingNilai) {
                req.flash("alertMessage", "Nilai untuk peserta ini sudah ada.");
                req.flash("alertStatus", "danger");
                return res.redirect("/post-test");
            }
    
            // Membuat nilai afektif baru
            const newNilaiPosTest = new nilaipostTest({
                namePeserta: pesertaId,
                nilaiCategory: nilaiCategory,
                nilaiPostTest: nilaiPostest || 0, // Default ke 0 jika tidak ada nilai post-test
                user: req.session.user.name, // Ambil user dari session
            });
    
            await newNilaiPosTest.save();
    
            req.flash("alertMessage", "Nilai Post Test berhasil ditambahkan.");
            req.flash("alertStatus", "success");
            res.redirect("/post-test");
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/post-test");
        }
    },
};
