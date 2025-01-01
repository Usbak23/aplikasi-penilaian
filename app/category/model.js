const mongoose = require('mongoose');

let categorySchema = mongoose.Schema({
    name: {
        type : String,
        require: [true,'Nama kategori harus diisi']
    },
    bobotNilai:{
        type:Number,
        requaire: [true, 'Bobot Nilai Persen Harus Diisi']
    }
})

module.exports = mongoose.model('Category', categorySchema)