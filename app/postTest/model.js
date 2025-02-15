const mongoose = require("mongoose");

let postTestSchema = mongoose.Schema(
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
    nilaiPostTest: {
      type: Number,
      required: [true, "Nilai Persepsi harus diisi"]
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("postTest", postTestSchema);
