const mongoose = require('mongoose');

let  NilaiKehadiranSchema = mongoose.Schema({
    user: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          require: [true, 'admin tidak boleh kosong']
        },
      ],
    namePeserta:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Peserta",
        requaire:[true, "Nama Peserta Tidak Boleh Kosong"]
    }],
    nilaiCategory:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Category",
        requaire: [true, "Nilai Kategori Tidak Boleh Kosong"]
    }],
    materi:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Materi",
        requaire:[true, "Materi Tidak Boleh Kosong"]
    }],
    nilaiPresensi:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"nilaiAbsensi",
        requaire:[true, "nilai absen tidak boleh kosong"]
    }]
})

module.exports = mongoose.model("nilaiKehadiran",NilaiKehadiranSchema)
