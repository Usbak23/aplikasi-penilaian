const mongoose = require("mongoose");
const { urlDb } = require('../config');



mongoose.connect(urlDb,{
    tlsAllowInvalidCertificates: true,
    tls: true,
    
    });

const db = mongoose.connection;


module.exports = db;
