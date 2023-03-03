const mongoose = require('mongoose');

const testSchema = mongoose.Schema({
  text: { type: String, required: true },
  number: { type: Number, required: true },
  date: { type: Date, required: false },
  user: { type: String, required: true },
});

module.exports = mongoose.model('Message', testSchema);