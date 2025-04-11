const mongoose = require("mongoose");

let recapAbsensischema = mongoose.Schema({
 namePeserta:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Peserta",
    require: [true, 'Peserta tidak boleh kosong']
 }],
 nameAbsensi:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Absensi",
    require: [true, 'Absensi tidak boleh kosong']
 }],
 status:[{
   type: mongoose.Schema.Types.ObjectId,
   ref:"nilaiAbsensi"
 }]

}, { timestamps: true });

module.exports = mongoose.model('RecapAbsensi', recapAbsensischema)