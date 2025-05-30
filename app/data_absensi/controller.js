const Absensi = require('../absensi/model');
const Peserta = require('../peserta/model');
const RecapAbsensi = require('./model');
const SetNilai = require('../nilai_absensi/model');

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      // Ambil semua peserta
      const pesertaList = await Peserta.find();

      // Ambil semua materi absensi dan populate nama materinya
      const materiList = await Absensi.find().populate("name_materi", "materi");

      // Ambil semua recap absensi dan populate referensi peserta, materi, dan status
      const data_absensi = await RecapAbsensi.find()
        .populate("namePeserta")
        .populate("nameAbsensi")
        .populate({
          path: "status",
          model: "nilaiAbsensi", // pastikan sesuai dengan ekspor nama model
          select: "status",  // hanya ambil field `status`
        });

      // Gabungkan peserta dan status kehadiran per materi
      const pesertaWithAbsensi = pesertaList.map((peserta) => {
        const materiStatus = materiList.map((materi) => {
          // Cari recap yang cocok untuk peserta dan materi
          const absensi = data_absensi.find((recap) => {
            const pesertaId = recap?.namePeserta?._id?.toString();
            const materiId = recap?.nameAbsensi?._id?.toString();
            return (
              pesertaId === peserta._id.toString() &&
              materiId === materi._id.toString()
            );
          });

          // Default status
          let statusLabel = "Belum Presensi";

          // Jika data absensi ditemukan dan statusnya valid
          if (absensi?.status?.[0]?.status) {
            statusLabel = absensi.status[0].status;
          }

          return {
            materiName: materi?.name_materi?.[0]?.materi || "Tidak ada materi",
            status: statusLabel,
          };
        });

        return {
          name: peserta.name,
          asal_cabang: peserta.asal_cabang,
          materiStatus,
        };
      });

      // Render halaman
      res.render("admin/data_absensi/view_data_absensi", {
        pesertaWithAbsensi,
        alert,
        name: req.session.user.name,
        title: "Halaman Data Absensi Peserta Training",
      });
    } catch (err) {
      console.log("Error di controller index recapAbsensi:", err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/recap_absensi");
    }
  },
  viewCreate: async (req, res) => {
  try {
    const peserta = await Peserta.find();
    const materi = await Absensi.find().populate("name_materi");
    const statusList = await SetNilai.find();
     const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = { message: alertMessage, status: alertStatus };


    res.render("admin/data_absensi/create", {
      peserta,
      materi,
      statusList,
      alert,
      name: req.session.user.name,
      title: "Input Absensi Peserta",
    });
  } catch (err) {
    console.error("Error di viewCreate:", err);
    req.flash("alertMessage", err.message);
    req.flash("alertStatus", "danger");
    res.redirect("/recap_absensi");
  }
},
  actionCreate: async (req, res) => {
  try {
    const { nameAbsensi, status } = req.body;
    const pesertaIds = Array.isArray(req.body.peserta) ? req.body.peserta : [req.body.peserta];

    if (!nameAbsensi || !status || pesertaIds.length === 0) {
      req.flash("alertMessage", "Mohon lengkapi semua data.");
      req.flash("alertStatus", "warning");
      return res.redirect("/recap_absensi/create");
    }

    const errors = [];

    for (let pesertaId of pesertaIds) {
      const alreadyExist = await RecapAbsensi.findOne({
        namePeserta: pesertaId,
        nameAbsensi,
      });

      if (alreadyExist) {
        const pesertaData = await Peserta.findById(pesertaId);
        errors.push(`${pesertaData.name} (${pesertaData.asal_cabang}) sudah memiliki data absensi untuk materi ini`);
        continue;
      }

      await RecapAbsensi.create({
        namePeserta: pesertaId,
        nameAbsensi,
        status: [status],
      });
    }

    if (errors.length > 0) {
      req.flash("alertMessage", errors.join(", "));
      req.flash("alertStatus", "danger");
      return res.redirect("/recap_absensi/create");
    }

    req.flash("alertMessage", "Absensi berhasil disimpan.");
    req.flash("alertStatus", "success");
    res.redirect("/recap_absensi");
  } catch (err) {
    console.log("Error saat create:", err);
    req.flash("alertMessage", err.message);
    req.flash("alertStatus", "danger");
    res.redirect("/recap_absensi/create");
  }
}




};
