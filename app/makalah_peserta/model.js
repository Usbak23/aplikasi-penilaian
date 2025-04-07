const mongoose = require("mongoose");

let makalahPesertaSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.String,
      ref: "User",
      required: [true, "Admin tidak boleh kosong"],
    },
    namePeserta:[ {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Peserta",
      required: [true, "Peserta tidak boleh kosong"],
    }],
    nilaiCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Kategori nilai tidak boleh kosong"],
    },
    nilaiPenulisan: {
      type: Number,
      required: [true, "Nilai Persepsi harus diisi"],
      min: [50, "Nilai Persepsi tidak boleh kurang dari 50"],
      max: [80, "Nilai Persepsi tidak boleh lebih dari 80"],
    },
    nilaiPenyampaian: {
      type: Number,
      required: [true, "Nilai Reaksi harus diisi"],
      min: [50, "Nilai Reaksi tidak boleh kurang dari 50"],
      max: [80, "Nilai Reaksi tidak boleh lebih dari 80"],
    },
    nilaiRespon: {
      type: Number,
      required: [true, "Nilai Adaptasi harus diisi"],
      min: [50, "Nilai Adaptasi tidak boleh kurang dari 50"],
      max: [80, "Nilai Adaptasi tidak boleh lebih dari 80"],
    },
    totalNilai:{
      type: Number,
      required : [true,"Total Nilai Harus Diisi"]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("MakalahPeserta", makalahPesertaSchema);
