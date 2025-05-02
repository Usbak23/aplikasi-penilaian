const mongoose = require("mongoose");

let nilaiTugasSchema = mongoose.Schema(
  {
    namePemandu: {
      type: mongoose.Schema.Types.String,
      ref: "User",
      required: [true, "Admin tidak boleh kosong"],
    },
    name_materi: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Materi",
      required: [true, "Materi tidak boleh kosong"],
    }],
    namePeserta:[ {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Peserta",
      required: [true, "Peserta tidak boleh kosong"],
    }],
    nilaiCategory: {
      type: mongoose.Schema.Types.String,
      ref: "Category",
      required: [true, "Kategori nilai tidak boleh kosong"],
    },
    nilaiPengetahuan: {
      type: Number,
      required: [true, "Nilai Persepsi harus diisi"],
      min: [0, "Nilai Persepsi tidak boleh kurang dari 0"],
      max: [80, "Nilai Persepsi tidak boleh lebih dari 80"],
    },
    nilaiPemahaman: {
      type: Number,
      required: [true, "Nilai Reaksi harus diisi"],
      min: [0, "Nilai Reaksi tidak boleh kurang dari 0"],
      max: [80, "Nilai Reaksi tidak boleh lebih dari 80"],
    },
    nilaiAnalisis: {
      type: Number,
      required: [true, "Nilai Adaptasi harus diisi"],
      min: [0, "Nilai Adaptasi tidak boleh kurang dari 0"],
      max: [80, "Nilai Adaptasi tidak boleh lebih dari 80"],
    },
    nilaiTotal:{
      type: Number,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("NilaiTugas", nilaiTugasSchema);
