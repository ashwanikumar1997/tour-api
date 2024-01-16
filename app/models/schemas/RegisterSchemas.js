const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RegisterSchema = new Schema(
  {
    created: { type: Date, default: Date.now },
    accountType: {
      type: String,
    },
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    phone: {
      type: String,
    },
  },
  {
    collection: "user",
  }
);

module.exports = mongoose.model("users", RegisterSchema);
