const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  label: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Doctor', doctorSchema);
