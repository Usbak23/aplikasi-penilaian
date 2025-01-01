const mongoose = require("mongoose");

let absenSchema = mongoose.Schema({
  user: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: [true, 'admin tidak boleh kosong']
    },
  ],
  name_materi: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Materi",
    }
  ],
  startTime: {
    type: Date,
    require: [true, "Waktu awal harus diisi"],
  },
  endTime: {
    type: Date,
    require: [true, 'Waktu Akhir Harus diisi']
  },
  barcodePath: { type: String, required: true },
  timestamps: {
    type: Date,
    default: Date.now
  },
  },
)

module.exports = mongoose.model('Absensi', absenSchema)
// const mongoose = require('mongoose');

// const absensiSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   startTime: { type: Date, required: true },
//   endTime: { type: Date, required: true },
//   barcodePath: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('Absensi', absensiSchema);
