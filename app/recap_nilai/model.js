const mongoose = require("mongoose");

let recapSchema = mongoose.Schema({
  nama: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Peserta",
    required: true,
  },
  nilaiKategori: [
    {
      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category", // Refer ke model Category
        required: true,
      },
      nilai: {
        type: Number,
        default: 0,
      },
    },
  ],
  totalNilai: {
    type: Number,
    default: 0,
  },
  predikat: {
    type: String,
  },
  keterangan: {
    type: String,
  },
});

module.exports = mongoose.model("RecapitulasiNilai", recapSchema);
