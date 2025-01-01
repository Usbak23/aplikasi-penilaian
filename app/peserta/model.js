const mongoose = require ("mongoose");

let pesertaSchema = mongoose.Schema({
    name: {
        type : String,
        require: [true,'Nama Peseerta harus diisi']
    },
    email:{
        type:String,
        requaire: [true, 'Email Peserta Persen Harus Diisi']
    },
    no_Hp:{
        type:Number,
        requaire: [true, 'No Handphone Peserta Harus Diisi']
    },
    asal_komisariat:{
        type:String,
        requaire: [true, 'Asal Komisariat Peserta Harus Diisi']
    },
    asal_cabang:{
        type:String,
        requaire: [true, 'Asal Cabang Peserta Harus Diisi']
    },
    password:{
        type:String,
        requaire: [true, 'Password Harus Diisi']
    }
})

module.exports = mongoose.model('Peserta', pesertaSchema)