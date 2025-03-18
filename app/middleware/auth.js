
module.exports = {
    isLoginAdmin: (req, res, next) => {
        console.log("DEBUG SESSION USER:", req.session.user);
        if (req.session.user === null || req.session.user === undefined || req.session.user.role !== "administrator") {
            req.flash("alertMessage", `Mohon Maaf Sesi Anda Telah Habis, Silahkan Login Kembali`);
            req.flash("alertStatus", "danger");
            res.redirect("/");
        } else{
            next()
        }
    },
<<<<<<< HEAD
    
=======
>>>>>>> cb0d566 (chore: install comppressi)
    isLoginPeserta: (req, res, next) => {
        console.log("DEBUG SESSION USER:", req.session.user);
        if (req.session.user === null || req.session.user === undefined || req.session.user.role !== "peserta") {
            req.flash("alertMessage", `Mohon Maaf Sesi Anda Telah Habis, Silahkan Login Kembali`);
            req.flash("alertStatus", "danger");
            res.redirect("/");
        } else{
            next()
        }
    }
}
