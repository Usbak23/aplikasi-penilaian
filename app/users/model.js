const mongoose = require("mongoose");

let userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "nama harus diisi"],
    },
    email: {
      type: String,
      require: [true, "email harus diisi"],
    },
    password: {
      type: String,
      require: [true, "kata sandi harus diisi"],
    },
    role: {
      type: String,
      enum: ["admininstrator", "admin"],
      default: "admin",
    },
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },
    phoneNumber: {
      type: String,
      require: [true, "nomor telepon harus diisi"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
