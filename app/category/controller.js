const Category = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      const category = await Category.find();
      res.render("admin/category/view_category", {
        category,
        alert,
        name : req.session.user.name,
        title : 'Halaman Kategori',
        // role : req.session.user.role,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/category");
    }
  },

  viewCreate: async (req, res) => {
    try {
      res.render("admin/category/create", {
        name : req.session.user.name,
        // role : req.session.user.role,
        title : 'Halaman Tambah Kategori'
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/category");
    }
  },

  actionCreate: async (req, res) => {
    try {

      const { name, bobotNilai } = req.body;
      let category = await Category({ name, bobotNilai });
      await category.save();

      req.flash("alertMessage", "Berhasil Tambah Kategori");
      req.flash("alertStatus", "success");

      res.redirect("/category");

    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/category");
    }
  },

  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;

      const category = await Category.findOne({ _id: id });

      res.render("admin/category/edit", {
        category,
        name : req.session.user.name,
        // role : req.session.user.role,
        title : 'Halaman Ubah Kategori'
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/category");
    }
  },

  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, bobotNilai } = req.body;

      await Category.findOneAndUpdate(
        {
          _id: id,
        },
        { name, bobotNilai }
      );

      req.flash('alertMessage', "Berhasil ubah kategori")
      req.flash('alertStatus', "success")

      res.redirect("/category");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/category");
    }
  },

  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      await Category.findOneAndDelete({ _id: id });

      req.flash("alertMessage", "Berhasil menghapus kategori");
      req.flash("alertStatus", "success");

      res.redirect("/category");
    } catch (err) {
      // // Menangani error dan memberikan notifikasi error (flash message)
      req.flash("alertMessage", `Terjadi kesalahan: ${err.message}`);
      req.flash("alertStatus", "danger");

      // Redirect ke halaman /category
      res.redirect("/category");
    }
  },
};
