module.exports = {
    isLoginAdmin: (req, res, next) => {
        if (req.session.user === null || req.session.user === undefined || req.session.user.role !== "administrator") {
            req.flash("alertMessage", `Mohon Maaf Sesi Anda Telah Habis, Silahkan Login Kembali`);
            req.flash("alertStatus", "danger");
            res.redirect("/");
        } else{
            next()
        }
    },
    isLoginPeserta: (req, res, next) => {
        if (req.session.user === null || req.session.user === undefined || req.session.user.role !== "peserta") {
            req.flash("alertMessage", `Mohon Maaf Sesi Anda Telah Habis, Silahkan Login Kembali`);
            req.flash("alertStatus", "danger");
            res.redirect("/");
        } else{
            next()
        }
    }
}
//  module.exports = {
//     // Middleware untuk semua user yang login
//     isLoginAdmin: (req, res, next) => {
//         if (req.session.user === null || req.session.user === undefined) {
//             req.flash("alertMessage", `Mohon Maaf Sesi Anda Telah Habis, Silahkan Login Kembali`);
//             req.flash("alertStatus", "danger");
//             res.redirect("/");
//         } else{
//             next()
//         }
//     },

//     // Middleware untuk role admin dan administrator
//     isRoleAdminOrAdministrator: (req, res, next) => {
//         if (!req.session.user) {
//             req.flash("alertMessage", `Mohon Maaf Sesi Anda Telah Habis, Silahkan Login Kembali`);
//             req.flash("alertStatus", "danger");
//             return res.redirect("/");
//         }

//         if (req.session.user.role !== "admin" && req.session.user.role !== "administrator") {
//             req.flash("alertMessage", `Akses Ditolak. Halaman ini hanya dapat diakses oleh Admin atau Administrator`);
//             req.flash("alertStatus", "danger");
//             return res.redirect("/"); // Redirect ke dashboard jika role tidak sesuai
//         }

//         next(); // Lanjutkan ke route berikutnya jika role sesuai
//     },

//     // Middleware untuk role administrator saja
//     isLoginAdministrator: (req, res, next) => {
//         if (!req.session.user) {
//             req.flash("alertMessage", `Mohon Maaf Sesi Anda Telah Habis, Silahkan Login Kembali`);
//             req.flash("alertStatus", "danger");
//             return res.redirect("/");
//         }

//         if (req.session.user.role !== "administrator") {
//             req.flash("alertMessage", `Halaman ini hanya dapat diakses oleh Administrator`);
//             req.flash("alertStatus", "danger");
//             return res.redirect("/");
//         }

//         next();
//     },

//     isPeserta: (req, res, next) => {
//         if (req.session && req.session.user && req.session.user.role === "peserta") {
//             return next();
//           } else {
//             req.flash("alertMessage", "Anda harus login sebagai peserta untuk mengakses fitur ini.");
//             req.flash("alertStatus", "danger");
//             return res.redirect("/login");
//           }
// }
// }
