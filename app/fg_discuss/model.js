const mongoose = require('mongoose');

let fg_discussSchema = mongoose.Schema({
    namePemandu: [{
        type: mongoose.Schema.Types.String,
        ref: "User",
        required: [true, "Pemandu tidak boleh kosong"],
    }],
    namePeserta:[ {
        type: mongoose.Schema.Types.String,
        ref: "Peserta",
        required: [true, "Peserta tidak boleh kosong"],
    }],
   nilaiCategory: [ {
    type: mongoose.Schema.Types.String,
    ref: "Category",
    required: [true, "Kategori nilai tidak boleh kosong"],
  }],
  nilaiFgd : {
      type: Number,
      required: [true, "Nilai Focus Groud Discussion harus diisi"],
      min: [50, "Nilai Persepsi tidak boleh kurang dari 50"],
      max: [80, "Nilai Persepsi tidak boleh lebih dari 80"],
  },
}, { timestamps: true });

module.exports = mongoose.model('fg_discuss', fg_discussSchema)