const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Donor", donorSchema);