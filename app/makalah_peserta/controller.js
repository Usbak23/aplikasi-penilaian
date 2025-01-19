const MakalahPeserta = require("./model");
const Peserta = require("../peserta/model");
const nilaiCategory = require("../category/model");

module.exports = {
  index: async (req, res) => {
    try {
        const alertMessage = req.flash("alertMessage");
        const alertStatus = req.flash("alertStatus");

        const alert = { message: alertMessage, status: alertStatus };

        // Fetch data dari database
        const makalah = await MakalahPeserta.find();
        const peserta = await Peserta.find();
        const nilai = await nilaiCategory.find(); // Pastikan nama model sesuai

        // Buat array makalahPeserta
        const makalahPeserta = peserta.map((pesertaItem) => {
            const nilaiPeserta = nilai.filter(
                (n) => pesertaItem._id.toString() === n.namePeserta.toString()
            );

            return nilaiPeserta.map((n) => ({
                pesertaName: pesertaItem.name,
                pesertaCabang: pesertaItem.cabang,
                makalahName: makalah.find((m) => m._id.toString() === n.name_makalah.toString())?.name || "Unknown",
                Makalah: n.nilaiMakalah || 0,
                Respon: n.nilaiRespon || 0,
                Penyampaian: n.nilaiPenyampaian || 0,
            }));
        }).flat(); // Menggabungkan hasil map array

        // Hitung jumlah dan rata-rata nilai
        const totalNilai = makalahPeserta.reduce(
            (total, n) => total + n.Makalah + n.Respon + n.Penyampaian,
            0
        );
        const rataRata = totalNilai / makalahPeserta.length;

        // Render ke view
        res.render("admin/makalah_peserta/view_makalah_peserta", {
            category: nilai,
            alert,
            name: req.session.user.name,
            title: "Halaman Nilai Makalah Peserta",
            makalahPeserta,
            Jumlah: Math.round(rataRata), // Pembulatan nilai rata-rata
        });
    } catch (err) {
        req.flash("alertMessage", `${err.message}`);
        req.flash("alertStatus", "danger");
        res.redirect("/makalah_peserta");
    }
},
  viewCreate: async (req, res) => {
    try {
      res.render("admin/makalah_peserta/create", {
        name: req.session.user.name,
        // role : req.session.user.role,
        title: "Halaman Nilai Makalah Peserta",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/makalah_peserta");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const {
        pesertaId,
        nilaiCategory,
        nilaiPenulisan,
        nilaiPenyampaian,
        nilaiRespon,
      } = req.body;
      let makalah = await MakalahPeserta({
        user: req.session.user.name,
        pesertaId,
        nilaiCategory,
        nilaiPenulisan,
        nilaiPenyampaian,
        nilaiRespon,
      });
      await makalah.save();
      req.flash("alertMessage", "Berhasil Tambah Nilai Makalah Peserta");
      req.flash("alertStatus", "success");
      res.redirect("/makalah_peserta");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/makalah_peserta");
    }
  },
};
