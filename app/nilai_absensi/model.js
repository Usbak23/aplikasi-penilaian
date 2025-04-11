const mongoose = require('mongoose');

let nilaiAbsensiSchema = mongoose.Schema({
    status: {
        type : String,
        enum : ['Hadir','Absen', 'Terlambat', 'Izin', 'Sakit', 'Belum Presensi'],
        default:"Belum Presensi"
    },
    bobotNilai:{
        type:Number,
        requaire: [true, 'Bobot Nilai Persen Harus Diisi']
    }
})

module.exports = mongoose.model('nilaiAbsensi', nilaiAbsensiSchema)