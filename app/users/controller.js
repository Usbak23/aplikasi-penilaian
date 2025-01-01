const User = require("./model");
const bcrypt = require("bcryptjs");

module.exports = {
  viewSignin: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };

      if (req.session.user === null || req.session.user === undefined) {
        res.render("admin/users/view_signin", {
          alert,
        //   title: "Halaman Signin",
        });
      } else {
        res.redirect("/");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/");
    }
  },
  viewRegister: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
  
      const alert = { message: alertMessage, status: alertStatus };
  
      if (req.session.user === null || req.session.user === undefined) {
        res.render("admin/users/view_register", {
          alert,
          // title: "Halaman Registrasi", // Jika ada penggunaan judul halaman
        });
      } else {
        res.redirect("/dashboard");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/");
    }
  },
  
  actionRegister: async (req, res) => {
    try {
      const { name, email, password, confirmPassword, phoneNumber } = req.body;

      // Periksa apakah sudah ada pengguna administrator yang terdaftar
      const existingAdmin = await User.findOne({ role: "admininstrator" });
      if (existingAdmin) {
        req.flash(
          "alertMessage",
          "Pendaftaran hanya bisa dilakukan oleh satu pengguna administrator."
        );
        req.flash("alertStatus", "danger");
        return res.redirect("/");
      }

      // Validasi password dan konfirmasi password
      if (password !== confirmPassword) {
        req.flash(
          "alertMessage",
          "Kata sandi dan konfirmasi kata sandi tidak cocok."
        );
        req.flash("alertStatus", "danger");
        return res.redirect("/register");
      }

      // Enkripsi password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Simpan data pengguna administrator ke database
      const user = new User({
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        role: "admininstrator", // Hanya mendaftar sebagai administrator
        status: "", // Status aktif
      });

      await user.save();

      req.flash("alertMessage", "Pendaftaran berhasil, silakan Login Kembali.");
      req.flash("alertStatus", "success");
      res.redirect("/");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/");
    }
  },

  actionSignin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const check = await User.findOne({ email: email });

      if (check) {
        if (check.status === "Y") {
          const checkPassword = await bcrypt.compare(password, check.password);
          if (checkPassword) {
            req.session.user = {
              id: check._id,
              email: check.email,
              status: check.status,
              name: check.name,
              role: check.role,
            };
            res.redirect("/dashboard");
          } else {
            req.flash("alertMessage", `Kata Sandi Yang Anda Masukan Salah`);
            req.flash("alertStatus", "danger");
            res.redirect("/");
          }
        } else {
          req.flash("alertMessage", `Mohon Maaf Status Anda Belum Aktif`);
          req.flash("alertStatus", "danger");
          res.redirect("/");
        }
      } else {
        req.flash("alertMessage", `Email Yang Anda Masukan Tidak Terdaftar`);
        req.flash("alertStatus", "danger");
        res.redirect("/");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/");
    }
  },

  index: async (req,res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus =req.flash("alertStatus");

      const alert ={message: alertMessage, status: alertStatus};
      const user = await User.find();
      res.render("admin/users/view_mot", {
        user,
        alert
      })
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/mot")
    };
},
  viewCreate: (req,res) => {
    try {
      res.render("admin/users/create");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/mot");
    }
  },
  actionCreate: async (req,res) => {
    try {
      const {name, email, phoneNumber, password, confirmPassword} = req.body;
      let pemandu = await User ({
        name, 
        email,
        phoneNumber,
        password,
        confirmPassword
      });
      await pemandu.save();
      req.flash("alertMessage", "Berhasil Tambah Pemandu");
      req.flash("alertStatus", "success");
      res.redirect("/mot");

    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/mot");
    }
  },

  actionLogout: (req, res) => {
    req.session.destroy();
    res.redirect("/");
  },
};
