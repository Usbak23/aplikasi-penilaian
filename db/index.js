const mongoose = require("mongoose");
const { urlDb } = require('../config');



mongoose.connect(urlDb,{
    tlsAllowInvalidCertificates: true,
    tls: true,
    tlsCAFile: "/path/to/ca.pem"
    });

const db = mongoose.connection;


module.exports = db;
