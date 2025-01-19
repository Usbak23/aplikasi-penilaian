const mongoose = require("mongoose");

let materiSchema = mongoose.Schema({
    materi:{
        type : String,
        require : [true, 'Materi Training Harus diisi']
    },
    narasumber: {
        type : String,
        require: [true,'Narasumber Harus diisi']
    },
    judulMateri:{
        type: String,
        require: [true,'Judul Materi Harus diisi']
    }
})

module.exports = mongoose.model('Materi', materiSchema)