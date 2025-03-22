const mongoose = require("mongoose");

let psikomotorikForumSchema = mongoose.Schema(
  {
    user: {
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Kategori nilai tidak boleh kosong"],
    },
    nilaiPenerimaan: {
      type: Number,
      required: [true, "Nilai Persepsi harus diisi"],
      min: [50, "Nilai Persepsi tidak boleh kurang dari 50"],
      max: [80, "Nilai Persepsi tidak boleh lebih dari 80"],
    },
    nilaiResponsif: {
      type: Number,
      required: [true, "Nilai Reaksi harus diisi"],
      min: [50, "Nilai Reaksi tidak boleh kurang dari 50"],
      max: [80, "Nilai Reaksi tidak boleh lebih dari 80"],
    },
    nilaiKarakterisasi: {
      type: Number,
      required: [true, "Nilai Adaptasi harus diisi"],
      min: [50, "Nilai Adaptasi tidak boleh kurang dari 50"],
      max: [80, "Nilai Adaptasi tidak boleh lebih dari 80"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PsikomotorikForum", psikomotorikForumSchema);
