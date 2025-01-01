const mongoose = require("mongoose");

let materiSchema = mongoose.Schema({
    materi:{
        type : String,
        require : [true, 'Materi Training Harus diisi']
    },
    narasumber: {
        type : String,
        require: ['Narasumber Harus diisi']
    },
    judulMateri:{
        type: String,
        require: ['Judul Materi Harus diisi']
    }
})

module.exports = mongoose.model('Materi', materiSchema)