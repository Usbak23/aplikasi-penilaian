const SetNilai = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      const nilaiPresensi = await SetNilai.find();
      res.render("admin/nilai_absensi/view_nilai", {
        nilaiPresensi,
        alert,
        name: req.session.user.name,
        title: "Halaman Nilai Absensi",
        // role : req.session.user.role,
      });

      
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nilai-presensi");
    }
  },

  viewCreate: async (req, res) => {
    try {
      const statusOptions = SetNilai.schema.path("status").enumValues;
      res.render("admin/nilai_absensi/create", {
        name: req.session.user.name,
        // role : req.session.user.role,
        title: "Halaman Tambah Nilai Absnsi",
        statusOptions
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nilai-presensi");
    }
  },

  actionCreate: async (req, res) => {
    try {
      const { status, bobotNilai } = req.body;

      // Cek apakah status sudah ada
    const existingStatus = await SetNilai.findOne({ status });
    if (existingStatus) {
      req.flash("alertMessage", `Status "${status}" sudah pernah ditambahkan`);
      req.flash("alertStatus", "danger");
      return res.redirect("/nilai-presensi");
    }
      let nilaiPresensi = await SetNilai({ status, bobotNilai });
      await nilaiPresensi.save();

      req.flash("alertMessage", "Berhasil Tambah Nilai Presensi");
      req.flash("alertStatus", "success");

      res.redirect("/nilai-presensi");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nilai-presensi");
    }
  },

  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;
  
      const nilaiPresensi = await SetNilai.findOne({ _id: id });
      const statusOptions = SetNilai.schema.path('status').enumValues;
  
      res.render("admin/nilai_absensi/edit", {
        nilaiPresensi,
        statusOptions, 
        name: req.session.user.name,
        title: "Halaman Ubah nilai presensi",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nilai-presensi");
    }
  },
  

  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { bobotNilai } = req.body;
  
      await SetNilai.findOneAndUpdate(
        { _id: id },
        { bobotNilai }
      );
  
      req.flash("alertMessage", "Berhasil ubah bobot nilai");
      req.flash("alertStatus", "success");
  
      res.redirect("/nilai-presensi");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nilai-presensi");
    }
  },
  
  

  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      await SetNilai.findOneAndDelete({ _id: id });

      req.flash("alertMessage", "Berhasil menghapus nilai presensi");
      req.flash("alertStatus", "success");

      res.redirect("/nilai-presensi");
    } catch (err) {
      // // Menangani error dan memberikan notifikasi error (flash message)
      req.flash("alertMessage", `Terjadi kesalahan: ${err.message}`);
      req.flash("alertStatus", "danger");

      // Redirect ke halaman /nilai-presensi
      res.redirect("/nilai-presensi");
    }
  },
};
