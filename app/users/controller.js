const User = require("./model");
const bcrypt = require("bcryptjs");
const Peserta = require("../peserta/model");

module.exports = {
  viewSignin: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };

      if (req.session.user === null || req.session.user === undefined) {
        res.render("admin/users/view_signin", {
          alert,
          title: "Halaman Signin",
        });
        console.log(">>>",alert);
        
      } else {
        res.redirect("/dashboard");
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
          title: "Halaman Registrasi",

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

  actionRegister: async (req, res) => {
    try {
      const { name, email, password, confirmPassword, phoneNumber } = req.body;

      // Periksa apakah sudah ada pengguna administrator yang terdaftar
      const existingAdmin = await User.findOne({ role: "administrator" });
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
        role: "administrator", // Hanya mendaftar sebagai administrator
        status: "Y", // Status aktif
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

  // actionSignin: async (req, res) => {
  //   try {
  //     const { email, password } = req.body;
  //     const check = await User.findOne({ email: email });

  //     if (check) {
  //       if (check.status === "Y") {
  //         const checkPassword = await bcrypt.compare(password, check.password);
  //         if (checkPassword) {
  //           req.session.user = {
  //             id: check._id,
  //             email: check.email,
  //             status: check.status,
  //             name: check.name,
  //             role: check.role,
  //           };
  //           res.redirect("/dashboard");
  //         } else {
  //           req.flash("alertMessage", `Kata Sandi Yang Anda Masukan Salah`);
  //           req.flash("alertStatus", "danger");
  //           res.redirect("/");
  //         }
  //       } else {
  //         req.flash("alertMessage", `Mohon Maaf Status Anda Belum Aktif`);
  //         req.flash("alertStatus", "danger");
  //         res.redirect("/");
  //       }
  //     } else {
  //       req.flash("alertMessage", `Email Yang Anda Masukan Tidak Terdaftar`);
  //       req.flash("alertStatus", "danger");
  //       res.redirect("/");
  //     }
  //   } catch (err) {
  //     req.flash("alertMessage", `${err.message}`);
  //     req.flash("alertStatus", "danger");
  //     res.redirect("/");
  //   }
  // },
  actionSignin : async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Cari pengguna di model User
      let check = await User.findOne({ email: email });
      let isPeserta = false;
  
      // Jika tidak ditemukan di User, cari di model Peserta
      if (!check) {
        check = await Peserta.findOne({ email: email });
        isPeserta = !!check; // Tandai bahwa pengguna adalah peserta
      }
  
      if (check) {
        // Jika pengguna adalah peserta, lewati pemeriksaan status
        if (isPeserta || check.status === "Y") {
          const checkPassword = await bcrypt.compare(password, check.password);
          if (checkPassword) {
            req.session.user = {
              id: check._id,
              email: check.email,
              name: check.name,
              role: isPeserta ? "peserta" : check.role, // Tetapkan role
            };
  
            // Redirect berdasarkan role
            if (isPeserta) {
              res.redirect("/dashboard-peserta");
            } else {
              res.redirect("/dashboard");
            }
          } else {
            req.flash("alertMessage", "Kata Sandi Yang Anda Masukkan Salah");
            req.flash("alertStatus", "danger");
            res.redirect("/");
          }
        } else {
          req.flash("alertMessage", "Mohon Maaf Status Anda Belum Aktif");
          req.flash("alertStatus", "danger");
          res.redirect("/");
        }
      } else {
        req.flash("alertMessage", "Email Yang Anda Masukkan Tidak Terdaftar");
        req.flash("alertStatus", "danger");
        res.redirect("/");
      }
    } catch (err) {
      req.flash("alertMessage", `Error: ${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/");
    }
  },
  
  

  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      const user = await User.find();
      res.render("admin/users/view_mot", {
        user,
        alert,
        name: req.session.user.name,
        title: "Halaman Master of Training",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/mot");
    }
  },
  viewCreate: (req, res) => {
    try {
      res.render("admin/users/create",{
        name: req.session.user.name,
        title: "Halaman Tambah Master of Training",
      },

      );
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/mot");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { name, email, phoneNumber, password, confirmPassword } = req.body;
      if (password !== confirmPassword) {
        req.flash(
          "alertMessage",
          "Kata sandi dan konfirmasi kata sandi tidak cocok."
        );
        req.flash("alertStatus", "danger");
        return res.redirect("/register");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      let pemandu = await User({
        name,
        email,
        phoneNumber,
        password : hashedPassword,

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
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findOne({ _id: id });
      res.render("admin/users/edit", {
        user,
        name: req.session.user.name,
        title: "Halaman Ubah Master of Training",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/mot");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, phoneNumber, password, confirmPassword } = req.body;
      if (password !== confirmPassword) {
        req.flash(
        "alertMessage",
        "Kata sandi dan konfirmasi kata sandi tidak cocok."
      );
      req.flash("alertStatus", "danger");
      return res.redirect("/register");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.findOneAndUpdate(
        { _id: id },
        { name, email, phoneNumber, password: hashedPassword }
      );const User = require("./model");
const bcrypt = require("bcryptjs");
const Peserta = require("../peserta/model");

module.exports = {
  viewSignin: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };

      if (!req.session.user) {
        res.render("admin/users/view_signin", {
          alert,
          title: "Halaman Signin",
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
  viewRegister: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };

      if (!req.session.user) {
        res.render("admin/users/view_register", {
          alert,
          title: "Halaman Registrasi",
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

  actionRegister: async (req, res) => {
    try {
      const { name, email, password, confirmPassword, phoneNumber } = req.body;

      if (password !== confirmPassword) {
        req.flash(
          "alertMessage",
          "Kata sandi dan konfirmasi kata sandi tidak cocok."
        );
        req.flash("alertStatus", "danger");
        return res.redirect("/register");
      }

      const existingAdmin = await User.findOne({ role: "administrator" });
      if (existingAdmin) {
        req.flash(
          "alertMessage",
          "Pendaftaran hanya bisa dilakukan oleh satu pengguna administrator."
        );
        req.flash("alertStatus", "danger");
        return res.redirect("/");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        role: "administrator",
        status: "Y",
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

      let check = await User.findOne({ email: email });
      let isPeserta = false;

      if (!check) {
        check = await Peserta.findOne({ email: email });
        isPeserta = !!check;
      }

      if (check) {
        if (isPeserta || check.status === "Y") {
          const checkPassword = await bcrypt.compare(password, check.password);
          if (checkPassword) {
            req.session.user = {
              id: check._id,
              email: check.email,
              name: check.name,
              role: isPeserta ? "peserta" : check.role,
            };

            if (isPeserta) {
              res.redirect("/dashboard-peserta");
            } else {
              res.redirect("/dashboard");
            }
          } else {
            req.flash("alertMessage", "Kata Sandi Yang Anda Masukkan Salah");
            req.flash("alertStatus", "danger");
            res.redirect("/");
          }
        } else {
          req.flash("alertMessage", "Mohon Maaf Status Anda Belum Aktif");
          req.flash("alertStatus", "danger");
          res.redirect("/");
        }
      } else {
        req.flash("alertMessage", "Email Yang Anda Masukkan Tidak Terdaftar");
        req.flash("alertStatus", "danger");
        res.redirect("/");
      }
    } catch (err) {
      req.flash("alertMessage", `Error: ${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/");
    }
  },

  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      const user = await User.find();
      res.render("admin/users/view_mot", {
        user,
        alert,
        name: req.session.user.name,
        title: "Halaman Master of Training",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/mot");
    }
  },
  viewCreate: (req, res) => {
    try {
      res.render("admin/users/create", {
        name: req.session.user.name,
        title: "Halaman Tambah Master of Training",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/mot");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { name, email, phoneNumber, password, confirmPassword } = req.body;

      if (password !== confirmPassword) {
        req.flash(
          "alertMessage",
          "Kata sandi dan konfirmasi kata sandi tidak cocok."
        );
        req.flash("alertStatus", "danger");
        return res.redirect("/register");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const pemandu = new User({
        name,
        email,
        phoneNumber,
        password: hashedPassword,
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
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findOne({ _id: id });
      res.render("admin/users/edit", {
        user,
        name: req.session.user.name,
        title: "Halaman Ubah Master of Training",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/mot");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, phoneNumber, password, confirmPassword } = req.body;

      if (password !== confirmPassword) {
        req.flash(
          "alertMessage",
          "Kata sandi dan konfirmasi kata sandi tidak cocok."
        );
        req.flash("alertStatus", "danger");
        return res.redirect("/register");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await User.findOneAndUpdate(
        { _id: id },
        { name, email, phoneNumber, password: hashedPassword }
      );

      req.flash("alertMessage", "Berhasil Ubah Pemandu");
      req.flash("alertStatus", "success");
      res.redirect("/mot");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/mot");
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;
      await User.findOneAndDelete({ _id: id });

      req.flash("alertMessage", "Berhasil Hapus Pemandu");
      req.flash("alertStatus", "success");
      res.redirect("/mot");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/mot");
    }
  },
  actionStatus: async (req, res) => {
    try {
      const { id } = req.params;
      let user = await User.findOne({ _id: id });
      let status = user.status === "Y" ? "N" : "Y";
      user = await User.findOneAndUpdate({ _id: id }, { status });

      req.flash("alertMessage", "Berhasil Ubah Status");
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
      req.flash("alertMessage", "Berhasil Ubah Pemandu");
      req.flash("alertStatus", "success");
      res.redirect("/mot");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/mot");
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;
      await User.findOneAndDelete({ _id: id });
      req.flash("alertMessage", "Berhasil Hapus Pemandu");
      req.flash("alertStatus", "success");
      res.redirect("/mot");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/mot");
    }
  },
  actionStatus: async (req, res) => {
    try {
      const { id } = req.params;
      let user = await User.findOne({ _id: id });
      let status = user.status === "Y" ? "N" : "Y";
      user = await User.findOneAndUpdate({ _id: id }, { status });
      req.flash("alertMessage", "Berhasil Ubah Status");
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
