const Materi = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      const materi = await Materi.find();
      res.render("admin/materi/view_materi", {
        materi,
        alert,
        // name : req.session.user.name,
        // role : req.session.user.role,
        title : 'Halaman Materi'
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/materi");
      
    }
  },
  viewCreate: async (req, res) => {
    try {
      res.render("admin/materi/create", {
        // name : req.session.user.name,
        // role : req.session.user.role,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/materi");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { materi, narasumber, judulMateri } = req.body;
      let materi_training = await Materi({ materi, narasumber, judulMateri });
      await materi_training.save();
      req.flash("alertMessage", "Berhasil Tambah Materi");
      req.flash("alertStatus", "success");
      res.redirect("/materi");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/materi");
    }
  },

  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const materi = await Materi.findOne({
        _id: id,
      });

      res.render("admin/materi/edit", {
        materi,
        name : req.session.user.name,
        role : req.session.user.role,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/materi");
    }
  },

  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { materi, judulMateri, narasumber } = req.body;

      await Materi.findOneAndUpdate(
        {
          _id: id,
        },
        {
          materi,
          judulMateri,
          narasumber,
        }
      );
      req.flash("alertMessage", "Berhasil Ubah Materi");
      req.flash("alertStatus", "success");
      res.redirect("/materi");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/materi");
    }
  },
  actionDelete: async(req, res )=>{
    try {
        const {id}=req.params;

        await Materi.findOneAndDelete({_id:id});
        req.flash("alertMessage", "Berhasil Hapus Materi");
        req.flash("alertStatus", "success");
        res.redirect("/materi");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
        res.redirect("/materi");
    }
  }
};
