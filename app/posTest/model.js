const mongoose = require("mongoose");

let PostTestSchema = mongoose.Schema(
    {
        namePemandu: {
            type: mongoose.Schema.Types.String,
            ref: "User",
            required: [true, "Admin tidak boleh kosong"],
        },
        nilaiCategory:[{
            type: mongoose.Schema.Types.String,
            ref: "Category",
            required: [true, "Kategori Nilai Tidak Boleh Kosong"]

        }],
       
        namePeserta:[ {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Peserta",
            required: [true, "Peserta tidak boleh kosong"],
        }],
        nilaiPostest:{
            type: Number,
            required: [true, "Nilai Post Test harus diisi"],
            min: [30, "Nilai Persepsi tidak boleh kurang dari 50"],
            max: [80, "Nilai Persepsi tidak boleh lebih dari 80"],
        },
    },
    { timestamps: true }
);  

module.exports = mongoose.model("postTest", PostTestSchema);