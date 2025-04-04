const Peserta = require("../peserta/model");
const Category = require("../category/model");
const fg_discuss = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      const peserta = await Peserta.find();
      const category = await Category.find();
      const nilai = await fg_discuss.find();


      const fgd = peserta.map((peserta) => {
          const nilai_fgd = nilai.find(
            (nilai) => peserta._id.toString() === nilai.namePeserta.toString()              
          );
          return {
            pesertaName: peserta.name,
            pesertaCabang: peserta.asal_cabang,
            nilai_fgd: nilai_fgd ? nilai_fgd.nilaiFgd : 0,
          };
      })
      res.render("admin/fg_discuss/view_fg_discuss", {
        fgd,
        alert,
        category: "Kognitif",
        peserta,
        name: req.session.user.name,
        title: "Halaman Nilai Focus Groud Discussion",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/fgd");
    }
  },
  viewCreate: async (req, res) => {
    try {
      const peserta = await Peserta.find();

      res.render("admin/fg_discuss/create", {
        category: "Kognitif",
        peserta,
        name: req.session.user.name,
        title: "Halaman Tambah Nilai Focus Groud Discussion",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/fgd");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { pesertaId, nilaiFgd } = req.body;

      if (!pesertaId) {
        req.flash("alertMessage", "Peserta harus dipilih.");
        req.flash("alertStatus", "danger");
        return res.redirect("/fgd/create");
      }

      // Pastikan nilaiFgd berada dalam batas yang diperbolehkan      
      const nilaiFgdValid = Math.max(50, Math.min(parseInt(nilaiFgd, 10), 80));

      const existingNilai = await fg_discuss.findOne({
        namePeserta: pesertaId,
      });

      if (existingNilai) {
        req.flash("alertMessage", "Nilai untuk peserta ini sudah ada.");
        req.flash("alertStatus", "danger");
        return res.redirect("/fgd");
      }

      const newNilaiFgd = new fg_discuss({
        namePeserta: pesertaId,
        nilaiCategory: "Kognitif", // Default kategori "Kognitif"
        nilaiFgd: nilaiFgdValid,
        namePemandu: req.session.user.name, // Menggunakan session user sebagai pemandu
      });

      await newNilaiFgd.save();

      req.flash("alertMessage", "Nilai Focus Groud Discussion berhasil ditambahkan.");
      req.flash("alertStatus", "success");
      res.redirect("/fgd");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/fgd/create");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const peserta = await Peserta.find();
      const { id } = req.params;
      const fg_discuss = await fg_discuss.findOne({ _id: id });
      res.render("admin/fg_discuss/edit", {
        fg_discuss,
        category: "Kognitif",
        peserta,
        name: req.session.user.name,
        title: "Halaman Ubah Nilai Focus Groud Discussion",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/fgd");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { pesertaId, nilaiFgd } = req.body;

      if (!pesertaId) {
        req.flash("alertMessage", "Peserta harus dipilih.");
        req.flash("alertStatus", "danger");
        return res.redirect(`/fgd/edit/${id}`);
      } else if (!nilaiFgd) {      
        req.flash("alertMessage", "Nilai Focus Groud Discussion harus diisi.");
        req.flash("alertStatus", "danger");
        return res.redirect(`/fgd/edit/${id}`);
      }

      // Pastikan nilaiFgd berada dalam batas yang diperbolehkan
      const nilaiFgdValid = Math.max(50, Math.min(parseInt(nilaiFgd, 10), 80));

      const existingNilai = await fg_discuss.findOne({
        namePeserta: pesertaId,
      });

      if (existingNilai) {
        req.flash("alertMessage", "Nilai untuk peserta ini sudah ada.");
        req.flash("alertStatus", "danger");
        return res.redirect("/fgd");
      }

      await fg_discuss.updateOne(
          { _id: id },
          {
              $set: {
                  namePeserta: pesertaId,
                  nilaiFgd: nilaiFgdValid,
                  namePemandu: req.session.user.name, // Menggunakan session user sebagai pemandu
              },
          }
      );      
      req.flash("alertMessage", "Nilai Focus Groud Discussion berhasil diubah.");
      req.flash("alertStatus", "success");
      res.redirect("/fgd");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/fgd/edit/${id}`);
    }
  }
      
};